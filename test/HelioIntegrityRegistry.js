const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HelioIntegrityRegistry", function () {
  let Registry;
  let registry;
  let owner;
  let clinic;
  let provider;
  let unauthorizedAccount;

  beforeEach(async function () {
    [owner, clinic, provider, unauthorizedAccount] = await ethers.getSigners();
    Registry = await ethers.getContractFactory("HelioIntegrityRegistry");
    registry = await Registry.deploy();
  });

  describe("Clinic Authorization", function () {
    it("Should authorize a clinic successfully if called by owner", async function () {
      await expect(registry.authorizeClinic(clinic.address, true))
        .to.emit(registry, "ClinicAuthorized")
        .withArgs(clinic.address, true);

      expect(await registry.isClinicAuthorized(clinic.address)).to.equal(true);
    });

    it("Should revoke a clinic successfully if called by owner", async function () {
      await registry.authorizeClinic(clinic.address, true);
      expect(await registry.isClinicAuthorized(clinic.address)).to.equal(true);

      await expect(registry.authorizeClinic(clinic.address, false))
        .to.emit(registry, "ClinicAuthorized")
        .withArgs(clinic.address, false);

      expect(await registry.isClinicAuthorized(clinic.address)).to.equal(false);
    });

    it("Should fail if clinic authorization is called by non-owner", async function () {
      await expect(
        registry.connect(unauthorizedAccount).authorizeClinic(clinic.address, true)
      ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });
  });

  describe("Record Hashing and Integrity", function () {
    const patientId = "patient-123";
    const docId = "doc-999";
    const sampleHash = ethers.keccak256(ethers.toUtf8Bytes("medical record content"));

    it("Should allow the owner to register a record hash", async function () {
      await expect(registry.registerRecordHash(patientId, docId, sampleHash))
        .to.emit(registry, "RecordRegistered")
        .withArgs(patientId, docId, sampleHash);

      const record = await registry.getRecord(patientId, docId);
      expect(record.docHash).to.equal(sampleHash);
      expect(record.isRegistered).to.equal(true);
    });

    it("Should allow an authorized clinic to register a record hash", async function () {
      await registry.authorizeClinic(clinic.address, true);

      await expect(registry.connect(clinic).registerRecordHash(patientId, docId, sampleHash))
        .to.emit(registry, "RecordRegistered")
        .withArgs(patientId, docId, sampleHash);
    });

    it("Should block unauthorized accounts from registering a record hash", async function () {
      await expect(
        registry.connect(unauthorizedAccount).registerRecordHash(patientId, docId, sampleHash)
      ).to.be.revertedWith("HelioIntegrityRegistry: caller is not authorized");
    });

    it("Should verify record integrity correctly for valid and invalid hashes", async function () {
      await registry.registerRecordHash(patientId, docId, sampleHash);

      // Verify with matching hash
      expect(await registry.verifyRecord(patientId, docId, sampleHash)).to.equal(true);

      // Verify with mismatching hash
      const fakeHash = ethers.keccak256(ethers.toUtf8Bytes("modified content"));
      expect(await registry.verifyRecord(patientId, docId, fakeHash)).to.equal(false);

      // Verify with non-existent doc ID
      expect(await registry.verifyRecord(patientId, "non-existent", sampleHash)).to.equal(false);
    });
  });

  describe("Patient Consent Management", function () {
    const patientId = "patient-123";

    it("Should allow updating and checking basic consent", async function () {
      // By default, checkConsent should return false
      expect(await registry.checkConsent(patientId, provider.address)).to.equal(false);

      // Grant consent with no expiration (expiry = 0)
      await expect(registry.updateConsent(patientId, provider.address, true, 0))
        .to.emit(registry, "ConsentUpdated")
        .withArgs(patientId, provider.address, true, 0);

      expect(await registry.checkConsent(patientId, provider.address)).to.equal(true);

      // Revoke consent
      await registry.updateConsent(patientId, provider.address, false, 0);
      expect(await registry.checkConsent(patientId, provider.address)).to.equal(false);
    });

    it("Should enforce temporal consent constraints", async function () {
      const currentBlock = await ethers.provider.getBlock("latest");
      const futureExpiry = currentBlock.timestamp + 3600; // 1 hour from now

      await registry.updateConsent(patientId, provider.address, true, futureExpiry);

      // Consent is active
      expect(await registry.checkConsent(patientId, provider.address)).to.equal(true);

      // Fast forward time past expiry
      await ethers.provider.send("evm_increaseTime", [3601]);
      await ethers.provider.send("evm_mine");

      // Consent should now be expired (checkConsent returns false)
      expect(await registry.checkConsent(patientId, provider.address)).to.equal(false);
    });
  });
});
