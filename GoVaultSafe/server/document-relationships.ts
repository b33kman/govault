import { GoogleSheetsService } from './google-services';

export interface DocumentRelationship {
  sourceId: string;
  sourceCategory: string;
  targetId: string;
  targetCategory: string;
  relationshipType: string;
  strength: number; // 0-1 confidence score
  description: string;
  autoDetected: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RelatedDocument {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  relationshipType: string;
  strength: number;
  description: string;
  lastModified: string;
  url?: string;
}

export interface DocumentImpact {
  affectedDocuments: RelatedDocument[];
  suggestedActions: string[];
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
}

// Relationship type definitions based on business logic
const RELATIONSHIP_TYPES = {
  // Insurance relationships
  INSURANCE_COVERS: 'insurance_covers', // Insurance policy covers property
  BENEFICIARY_OF: 'beneficiary_of', // Person is beneficiary of policy
  
  // Financial relationships
  ACCOUNT_HOLDER: 'account_holder', // Person holds financial account
  LOAN_SECURES: 'loan_secures', // Loan is secured by property
  PAYMENT_SOURCE: 'payment_source', // Account pays for insurance/services
  
  // Property relationships
  OWNS: 'owns', // Person owns property
  MAINTAINS: 'maintains', // Service contact maintains property
  TITLED_TO: 'titled_to', // Property title is in person's name
  
  // Legal relationships
  GOVERNS: 'governs', // Legal document governs property/person
  WITNESSES: 'witnesses', // Person witnesses legal document
  EXECUTES: 'executes', // Person executes legal document
  
  // Business relationships
  OPERATES: 'operates', // Person operates business
  LICENSED_FOR: 'licensed_for', // License applies to business activity
  
  // Contact relationships
  SERVICES: 'services', // Contact provides services for category
  EMERGENCY_FOR: 'emergency_for', // Emergency contact for person
  PROFESSIONAL_FOR: 'professional_for', // Professional serves family
  
  // Document relationships
  SUPPORTS: 'supports', // Document supports another document
  REFERENCES: 'references', // Document references another
  SUPERSEDES: 'supersedes' // Document replaces another
};

export class DocumentRelationshipService {
  private sheetsService: GoogleSheetsService;

  constructor(user: any) {
    this.sheetsService = new GoogleSheetsService(user);
  }

  // Analyze document content and find potential relationships
  async analyzeDocumentRelationships(
    documentData: any,
    category: string,
    allDocuments: any[]
  ): Promise<DocumentRelationship[]> {
    const relationships: DocumentRelationship[] = [];

    // Property-based relationship detection
    if (category === 'Property') {
      // Find related insurance policies
      const insuranceRelations = await this.findInsuranceForProperty(documentData, allDocuments);
      relationships.push(...insuranceRelations);

      // Find related loans/mortgages
      const loanRelations = await this.findLoansForProperty(documentData, allDocuments);
      relationships.push(...loanRelations);
    }

    // Insurance-based relationship detection
    if (category === 'Insurance') {
      // Find covered properties
      const propertyRelations = await this.findPropertiesForInsurance(documentData, allDocuments);
      relationships.push(...propertyRelations);

      // Find beneficiaries in contacts/family
      const beneficiaryRelations = await this.findBeneficiaries(documentData, allDocuments);
      relationships.push(...beneficiaryRelations);
    }

    // Finance-based relationship detection
    if (category === 'Finance') {
      // Find automatic payments (insurance, utilities)
      const paymentRelations = await this.findAutomaticPayments(documentData, allDocuments);
      relationships.push(...paymentRelations);
    }

    // Legal-based relationship detection
    if (category === 'Legal') {
      // Find governed properties and beneficiaries
      const legalRelations = await this.findLegallyGoverned(documentData, allDocuments);
      relationships.push(...legalRelations);
    }

    // Contact-based relationship detection
    if (category === 'Contacts') {
      // Find professional service relationships
      const serviceRelations = await this.findProfessionalServices(documentData, allDocuments);
      relationships.push(...serviceRelations);
    }

    return relationships;
  }

  // Find insurance policies that cover a property
  private async findInsuranceForProperty(
    propertyData: any,
    allDocuments: any[]
  ): Promise<DocumentRelationship[]> {
    const relationships: DocumentRelationship[] = [];
    const propertyAddress = propertyData.fields?.address?.toLowerCase() || '';
    const propertyType = propertyData.fields?.propertyType?.toLowerCase() || '';

    // Search insurance documents for matching addresses or property references
    const insuranceDocs = allDocuments.filter(doc => doc.category === 'Insurance');
    
    for (const insuranceDoc of insuranceDocs) {
      let strength = 0;
      let description = '';

      // Check for address matches
      const insuranceAddress = insuranceDoc.fields?.propertyAddress?.toLowerCase() || 
                             insuranceDoc.fields?.address?.toLowerCase() || '';
      
      if (propertyAddress && insuranceAddress && 
          this.addressesMatch(propertyAddress, insuranceAddress)) {
        strength += 0.8;
        description += 'Address match';
      }

      // Check for property type matches
      const policyType = insuranceDoc.fields?.policyType?.toLowerCase() || '';
      if (propertyType === 'home' && policyType.includes('home')) strength += 0.6;
      if (propertyType === 'auto' && policyType.includes('auto')) strength += 0.6;
      if (propertyType === 'property' && policyType.includes('property')) strength += 0.5;

      if (strength > 0.5) {
        relationships.push({
          sourceId: propertyData.id,
          sourceCategory: 'Property',
          targetId: insuranceDoc.id,
          targetCategory: 'Insurance',
          relationshipType: RELATIONSHIP_TYPES.INSURANCE_COVERS,
          strength,
          description: description || 'Insurance policy covers this property',
          autoDetected: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    return relationships;
  }

  // Find properties covered by an insurance policy
  private async findPropertiesForInsurance(
    insuranceData: any,
    allDocuments: any[]
  ): Promise<DocumentRelationship[]> {
    const relationships: DocumentRelationship[] = [];
    const policyType = insuranceData.fields?.policyType?.toLowerCase() || '';
    const insuranceAddress = insuranceData.fields?.propertyAddress?.toLowerCase() || 
                           insuranceData.fields?.address?.toLowerCase() || '';

    const propertyDocs = allDocuments.filter(doc => doc.category === 'Property');

    for (const propertyDoc of propertyDocs) {
      let strength = 0;
      let description = '';

      const propertyAddress = propertyDoc.fields?.address?.toLowerCase() || '';
      const propertyType = propertyDoc.fields?.propertyType?.toLowerCase() || '';

      // Address matching
      if (insuranceAddress && propertyAddress && 
          this.addressesMatch(insuranceAddress, propertyAddress)) {
        strength += 0.8;
        description += 'Address match';
      }

      // Type matching
      if (policyType.includes('home') && propertyType === 'home') strength += 0.6;
      if (policyType.includes('auto') && propertyType === 'vehicle') strength += 0.6;

      if (strength > 0.5) {
        relationships.push({
          sourceId: insuranceData.id,
          sourceCategory: 'Insurance',
          targetId: propertyDoc.id,
          targetCategory: 'Property',
          relationshipType: RELATIONSHIP_TYPES.INSURANCE_COVERS,
          strength,
          description: description || 'Property covered by this insurance policy',
          autoDetected: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    return relationships;
  }

  // Find loans/mortgages related to property
  private async findLoansForProperty(
    propertyData: any,
    allDocuments: any[]
  ): Promise<DocumentRelationship[]> {
    const relationships: DocumentRelationship[] = [];
    const propertyAddress = propertyData.fields?.address?.toLowerCase() || '';
    const purchasePrice = propertyData.fields?.purchasePrice || 0;

    const financeDocs = allDocuments.filter(doc => 
      doc.category === 'Finance' && 
      (doc.subcategory === 'Loans' || doc.fields?.accountType?.toLowerCase().includes('loan'))
    );

    for (const loanDoc of financeDocs) {
      let strength = 0;
      let description = '';

      const loanPurpose = loanDoc.fields?.purpose?.toLowerCase() || '';
      const loanAmount = loanDoc.fields?.principalAmount || loanDoc.fields?.balance || 0;
      const loanAddress = loanDoc.fields?.collateralAddress?.toLowerCase() || '';

      // Address matching for mortgages
      if (propertyAddress && loanAddress && 
          this.addressesMatch(propertyAddress, loanAddress)) {
        strength += 0.9;
        description += 'Collateral address match';
      }

      // Loan purpose matching
      if (loanPurpose.includes('home') || loanPurpose.includes('mortgage')) {
        strength += 0.7;
        description += ', Mortgage loan';
      }

      // Amount correlation (rough estimate)
      if (purchasePrice > 0 && loanAmount > 0 && 
          Math.abs(loanAmount - purchasePrice) / purchasePrice < 0.2) {
        strength += 0.5;
        description += ', Amount correlation';
      }

      if (strength > 0.6) {
        relationships.push({
          sourceId: loanDoc.id,
          sourceCategory: 'Finance',
          targetId: propertyData.id,
          targetCategory: 'Property',
          relationshipType: RELATIONSHIP_TYPES.LOAN_SECURES,
          strength,
          description: description || 'Loan secured by this property',
          autoDetected: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    return relationships;
  }

  // Find beneficiaries in insurance policies
  private async findBeneficiaries(
    insuranceData: any,
    allDocuments: any[]
  ): Promise<DocumentRelationship[]> {
    const relationships: DocumentRelationship[] = [];
    const beneficiaries = insuranceData.fields?.beneficiaries || [];

    if (!Array.isArray(beneficiaries)) return relationships;

    const contactDocs = allDocuments.filter(doc => doc.category === 'Contacts');
    const familyDocs = allDocuments.filter(doc => doc.category === 'Family IDs');

    for (const beneficiary of beneficiaries) {
      const beneficiaryName = beneficiary.toLowerCase();

      // Search contacts
      for (const contact of contactDocs) {
        const contactName = contact.fields?.name?.toLowerCase() || '';
        if (this.namesMatch(beneficiaryName, contactName)) {
          relationships.push({
            sourceId: contact.id,
            sourceCategory: 'Contacts',
            targetId: insuranceData.id,
            targetCategory: 'Insurance',
            relationshipType: RELATIONSHIP_TYPES.BENEFICIARY_OF,
            strength: 0.9,
            description: 'Named beneficiary of insurance policy',
            autoDetected: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      }

      // Search family IDs
      for (const family of familyDocs) {
        const familyName = family.fields?.fullName?.toLowerCase() || '';
        if (this.namesMatch(beneficiaryName, familyName)) {
          relationships.push({
            sourceId: family.id,
            sourceCategory: 'Family IDs',
            targetId: insuranceData.id,
            targetCategory: 'Insurance',
            relationshipType: RELATIONSHIP_TYPES.BENEFICIARY_OF,
            strength: 0.95,
            description: 'Family member beneficiary of insurance policy',
            autoDetected: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      }
    }

    return relationships;
  }

  // Find automatic payment relationships
  private async findAutomaticPayments(
    financeData: any,
    allDocuments: any[]
  ): Promise<DocumentRelationship[]> {
    const relationships: DocumentRelationship[] = [];
    const accountNumber = financeData.fields?.accountNumber || '';
    
    // Look for insurance policies with auto-pay
    const insuranceDocs = allDocuments.filter(doc => doc.category === 'Insurance');
    
    for (const insuranceDoc of insuranceDocs) {
      const paymentMethod = insuranceDoc.fields?.paymentMethod || '';
      const paymentAccount = insuranceDoc.fields?.paymentAccount || '';

      if (paymentAccount && accountNumber && 
          paymentAccount.includes(accountNumber.slice(-4))) {
        relationships.push({
          sourceId: financeData.id,
          sourceCategory: 'Finance',
          targetId: insuranceDoc.id,
          targetCategory: 'Insurance',
          relationshipType: RELATIONSHIP_TYPES.PAYMENT_SOURCE,
          strength: 0.8,
          description: 'Account pays insurance premiums',
          autoDetected: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    return relationships;
  }

  // Find documents governed by legal documents
  private async findLegallyGoverned(
    legalData: any,
    allDocuments: any[]
  ): Promise<DocumentRelationship[]> {
    const relationships: DocumentRelationship[] = [];
    const documentType = legalData.fields?.documentType?.toLowerCase() || '';
    const parties = legalData.fields?.parties || [];

    // Estate planning documents govern property and financial accounts
    if (documentType.includes('will') || documentType.includes('trust')) {
      // Find governed properties
      const propertyDocs = allDocuments.filter(doc => doc.category === 'Property');
      for (const property of propertyDocs) {
        relationships.push({
          sourceId: legalData.id,
          sourceCategory: 'Legal',
          targetId: property.id,
          targetCategory: 'Property',
          relationshipType: RELATIONSHIP_TYPES.GOVERNS,
          strength: 0.7,
          description: 'Estate planning document governs property distribution',
          autoDetected: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      // Find governed financial accounts
      const financeDocs = allDocuments.filter(doc => doc.category === 'Finance');
      for (const account of financeDocs) {
        relationships.push({
          sourceId: legalData.id,
          sourceCategory: 'Legal',
          targetId: account.id,
          targetCategory: 'Finance',
          relationshipType: RELATIONSHIP_TYPES.GOVERNS,
          strength: 0.7,
          description: 'Estate planning document governs account distribution',
          autoDetected: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    return relationships;
  }

  // Find professional service relationships
  private async findProfessionalServices(
    contactData: any,
    allDocuments: any[]
  ): Promise<DocumentRelationship[]> {
    const relationships: DocumentRelationship[] = [];
    const specialty = contactData.fields?.specialty?.toLowerCase() || '';
    const company = contactData.fields?.company?.toLowerCase() || '';

    // Insurance agents
    if (specialty.includes('insurance') || company.includes('insurance')) {
      const insuranceDocs = allDocuments.filter(doc => doc.category === 'Insurance');
      for (const insurance of insuranceDocs) {
        const insuranceCompany = insurance.fields?.company?.toLowerCase() || '';
        if (company.includes(insuranceCompany) || insuranceCompany.includes(company)) {
          relationships.push({
            sourceId: contactData.id,
            sourceCategory: 'Contacts',
            targetId: insurance.id,
            targetCategory: 'Insurance',
            relationshipType: RELATIONSHIP_TYPES.PROFESSIONAL_FOR,
            strength: 0.8,
            description: 'Insurance agent for this policy',
            autoDetected: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      }
    }

    // Financial advisors
    if (specialty.includes('financial') || specialty.includes('advisor')) {
      const financeDocs = allDocuments.filter(doc => doc.category === 'Finance');
      for (const account of financeDocs) {
        relationships.push({
          sourceId: contactData.id,
          sourceCategory: 'Contacts',
          targetId: account.id,
          targetCategory: 'Finance',
          relationshipType: RELATIONSHIP_TYPES.PROFESSIONAL_FOR,
          strength: 0.6,
          description: 'Financial advisor for account management',
          autoDetected: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    // Attorneys
    if (specialty.includes('attorney') || specialty.includes('legal')) {
      const legalDocs = allDocuments.filter(doc => doc.category === 'Legal');
      for (const legal of legalDocs) {
        const attorney = legal.fields?.attorney?.toLowerCase() || '';
        const contactName = contactData.fields?.name?.toLowerCase() || '';
        if (this.namesMatch(attorney, contactName)) {
          relationships.push({
            sourceId: contactData.id,
            sourceCategory: 'Contacts',
            targetId: legal.id,
            targetCategory: 'Legal',
            relationshipType: RELATIONSHIP_TYPES.PROFESSIONAL_FOR,
            strength: 0.9,
            description: 'Attorney for legal document',
            autoDetected: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      }
    }

    return relationships;
  }

  // Get all relationships for a document
  async getDocumentRelationships(documentId: string, category: string): Promise<RelatedDocument[]> {
    try {
      // In production, this would query the relationships sheet in Google Sheets
      // For now, we'll return mock data that demonstrates the relationship structure
      
      const mockRelationships: RelatedDocument[] = [];
      
      // Based on category, return relevant mock relationships
      if (category === 'Property') {
        mockRelationships.push(
          {
            id: 'ins-001',
            title: 'Home Insurance Policy - State Farm',
            category: 'Insurance',
            subcategory: 'Home Insurance',
            relationshipType: 'insurance_covers',
            strength: 0.95,
            description: 'Insurance policy covers this property',
            lastModified: '2024-12-20',
            url: '/insurance/ins-001'
          },
          {
            id: 'fin-001',
            title: 'Mortgage - Chase Bank',
            category: 'Finance',
            subcategory: 'Loans',
            relationshipType: 'loan_secures',
            strength: 0.90,
            description: 'Mortgage loan secured by this property',
            lastModified: '2024-12-15',
            url: '/finance/fin-001'
          },
          {
            id: 'con-001',
            title: 'John Smith - Insurance Agent',
            category: 'Contacts',
            subcategory: 'Professional Services',
            relationshipType: 'services',
            strength: 0.80,
            description: 'Insurance agent for property coverage',
            lastModified: '2024-12-10',
            url: '/contacts/con-001'
          }
        );
      } else if (category === 'Insurance') {
        mockRelationships.push(
          {
            id: 'prop-001',
            title: '123 Main Street Home',
            category: 'Property',
            subcategory: 'Real Estate',
            relationshipType: 'insurance_covers',
            strength: 0.95,
            description: 'Property covered by this insurance policy',
            lastModified: '2024-12-18',
            url: '/property/prop-001'
          },
          {
            id: 'fam-001',
            title: 'Jane Doe - Spouse',
            category: 'Family IDs',
            subcategory: 'Family Member',
            relationshipType: 'beneficiary_of',
            strength: 0.98,
            description: 'Primary beneficiary of insurance policy',
            lastModified: '2024-12-12',
            url: '/family-ids/fam-001'
          }
        );
      } else if (category === 'Finance') {
        mockRelationships.push(
          {
            id: 'ins-002',
            title: 'Auto Insurance - Allstate',
            category: 'Insurance',
            subcategory: 'Auto Insurance',
            relationshipType: 'payment_source',
            strength: 0.85,
            description: 'Account pays insurance premiums automatically',
            lastModified: '2024-12-19',
            url: '/insurance/ins-002'
          }
        );
      }

      return mockRelationships;
    } catch (error) {
      console.error('Error getting document relationships:', error);
      return [];
    }
  }

  // Analyze impact of changes to a document
  async analyzeDocumentImpact(documentId: string, category: string, changes: any): Promise<DocumentImpact> {
    const relatedDocs = await this.getDocumentRelationships(documentId, category);
    const suggestedActions: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    // Analyze based on category and relationships
    if (category === 'Property' && changes.address) {
      suggestedActions.push('Update address on related insurance policies');
      suggestedActions.push('Notify mortgage lender of address change');
      riskLevel = 'medium';
    }

    if (category === 'Insurance' && changes.renewalDate) {
      suggestedActions.push('Update calendar reminders for renewal');
      suggestedActions.push('Review coverage amounts for adequacy');
      riskLevel = 'medium';
    }

    if (category === 'Finance' && changes.accountNumber) {
      suggestedActions.push('Update automatic payment setups');
      suggestedActions.push('Notify payees of new account information');
      riskLevel = 'high';
    }

    return {
      affectedDocuments: relatedDocs,
      suggestedActions,
      riskLevel,
      description: `Changes to this ${category.toLowerCase()} document may affect ${relatedDocs.length} related documents.`
    };
  }

  // Utility functions for matching
  private addressesMatch(address1: string, address2: string): boolean {
    const normalize = (addr: string) => addr.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
    const norm1 = normalize(address1);
    const norm2 = normalize(address2);
    
    // Check for substantial overlap (at least 60% of words match)
    const words1 = norm1.split(' ');
    const words2 = norm2.split(' ');
    const intersection = words1.filter(word => words2.includes(word));
    
    return intersection.length / Math.max(words1.length, words2.length) > 0.6;
  }

  private namesMatch(name1: string, name2: string): boolean {
    const normalize = (name: string) => name.replace(/[^\w\s]/g, '').toLowerCase().trim();
    const norm1 = normalize(name1);
    const norm2 = normalize(name2);
    
    // Exact match or substantial overlap
    if (norm1 === norm2) return true;
    
    const words1 = norm1.split(' ');
    const words2 = norm2.split(' ');
    const intersection = words1.filter(word => word.length > 2 && words2.includes(word));
    
    return intersection.length >= 2 || (intersection.length === 1 && intersection[0].length > 5);
  }
}