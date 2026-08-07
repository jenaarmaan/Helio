// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract HelioIntegrityRegistry is Ownable {
    struct MedicalRecord {
        bytes32 docHash;
        uint256 timestamp;
        bool isRegistered;
    }

    struct ConsentRule {
        bool allowed;
        uint256 expiry;
    }

    // Mapping: patientId => docId => MedicalRecord
    mapping(string => mapping(string => MedicalRecord)) private records;
    
    // Mapping: patientId => providerAddress => ConsentRule
    mapping(string => mapping(address => ConsentRule)) private consentRegistry;

    // Mapping of authorized clinic addresses allowed to register records
    mapping(address => bool) private authorizedClinics;

    event RecordRegistered(string indexed patientId, string indexed docId, bytes32 docHash);
    event ConsentUpdated(string indexed patientId, address indexed provider, bool allowed, uint256 expiry);
    event ClinicAuthorized(address indexed clinic, bool authorized);

    modifier onlyAuthorizedClinic() {
        require(authorizedClinics[msg.sender] || msg.sender == owner(), "HelioIntegrityRegistry: caller is not authorized");
        _;
    }

    constructor() Ownable(msg.sender) {
        // By default, the owner is authorized as a clinic
        authorizedClinics[msg.sender] = true;
    }

    function authorizeClinic(address clinic, bool authorized) external onlyOwner {
        authorizedClinics[clinic] = authorized;
        emit ClinicAuthorized(clinic, authorized);
    }

    function isClinicAuthorized(address clinic) external view returns (bool) {
        return authorizedClinics[clinic];
    }

    function registerRecordHash(string memory patientId, string memory docId, bytes32 docHash) external onlyAuthorizedClinic {
        records[patientId][docId] = MedicalRecord(docHash, block.timestamp, true);
        emit RecordRegistered(patientId, docId, docHash);
    }

    function verifyRecord(string memory patientId, string memory docId, bytes32 docHash) external view returns (bool) {
        if (!records[patientId][docId].isRegistered) {
            return false;
        }
        return records[patientId][docId].docHash == docHash;
    }

    function getRecord(string memory patientId, string memory docId) external view returns (bytes32 docHash, uint256 timestamp, bool isRegistered) {
        MedicalRecord memory record = records[patientId][docId];
        return (record.docHash, record.timestamp, record.isRegistered);
    }

    function updateConsent(string memory patientId, address provider, bool allowed, uint256 expiry) external {
        consentRegistry[patientId][provider] = ConsentRule(allowed, expiry);
        emit ConsentUpdated(patientId, provider, allowed, expiry);
    }

    function checkConsent(string memory patientId, address provider) external view returns (bool) {
        ConsentRule memory rule = consentRegistry[patientId][provider];
        if (!rule.allowed) {
            return false;
        }
        if (rule.expiry > 0 && block.timestamp > rule.expiry) {
            return false;
        }
        return true;
    }
}
