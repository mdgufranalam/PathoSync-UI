import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { CustomPrint } from './CustomPrint';
import { PrintSettings } from './PrintSettings';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Printer, 
  Download, 
  Share, 
  Settings, 
  FileText,
  MessageSquare,
  Mail
} from 'lucide-react';

interface GlobalPrintManagerProps {
  reportData?: any;
  billData?: any;
  documentType: 'report' | 'bill' | 'prescription' | 'certificate';
  patientName?: string;
  onClose: () => void;
}

const defaultPrintSettings = {
  basicSettings: {
    printEachDepartmentInNewPage: false,
    numberOfLinesInOnePage: 20,
    fontSize: 0.8,
    spaceBetweenLines: 0.0
  },
  letterhead: {
    enabled: true,
    logoUrl: '',
    clinicName: 'PathoSync Laboratory',
    address: '123 Healthcare Street, Medical City, State - 123456, India',
    phone: '+91-98765-43210',
    email: 'info@pathosync.com',
    website: 'www.pathosync.com',
    registrationNumber: 'LAB/2024/001'
  },
  signatures: {
    useSignaturesOnlyInLastPage: true,
    signatures: [
      {
        id: 'sig-1',
        name: 'Dr. Priya Sharma',
        designation: 'Chief Pathologist',
        signatureUrl: ''
      },
      {
        id: 'sig-2',
        name: 'Dr. Rajesh Kumar',
        designation: 'Lab Director',
        signatureUrl: ''
      }
    ]
  },
  billPrint: {
    showHeader: true,
    showFooter: true,
    showBankDetails: true,
    showTermsConditions: true
  }
};

export function GlobalPrintManager({ 
  reportData, 
  billData, 
  documentType, 
  patientName, 
  onClose 
}: GlobalPrintManagerProps) {
  const [showCustomPrint, setShowCustomPrint] = useState(false);
  const [showPrintSettings, setShowPrintSettings] = useState(false);
  const [printSettings, setPrintSettings] = useState(defaultPrintSettings);

  const mockTests = [
    { id: 'test-1', name: 'Complete Blood Count (CBC)', selected: true },
    { id: 'test-2', name: 'Lipid Profile', selected: true },
    { id: 'test-3', name: 'Thyroid Function Test', selected: true },
    { id: 'test-4', name: 'Liver Function Test', selected: false },
    { id: 'test-5', name: 'Kidney Function Test', selected: false }
  ];

  const handleRegularPrint = () => {
    // Standard print functionality
    window.print();
    onClose();
  };

  const handleCustomPrintOptions = (options: any) => {
    console.log('Custom print options:', options);
    // Here you would apply the custom options and print
    window.print();
  };

  const handleDownloadPDF = () => {
    // PDF generation and download
    console.log('Downloading PDF...');
    // Implementation for PDF generation
  };

  const handleWhatsAppShare = () => {
    // WhatsApp sharing functionality for Indian market
    const message = `Hi ${patientName}, your lab report is ready. Please find the report attached. For any queries, contact us at +91-98765-43210`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSMSShare = () => {
    // SMS sharing with link
    const message = `Dear ${patientName}, your lab report is ready. Download link: https://pathosync.com/reports/download?id=xyz. Contact: +91-98765-43210`;
    console.log('Sending SMS:', message);
    // Implementation for SMS API
  };

  const handleEmailShare = () => {
    // Email sharing
    const subject = `Lab Report - ${patientName}`;
    const body = `Dear ${patientName},\n\nYour lab report is ready and attached to this email.\n\nBest regards,\nPathoSync Laboratory\n+91-98765-43210`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const getDocumentTitle = () => {
    switch (documentType) {
      case 'report': return 'Lab Report';
      case 'bill': return 'Bill/Invoice';
      case 'prescription': return 'Prescription';
      case 'certificate': return 'Medical Certificate';
      default: return 'Document';
    }
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Printer className="w-5 h-5" />
              Print & Share {getDocumentTitle()}
            </DialogTitle>
            <DialogDescription>
              Choose how you want to print or share this {documentType}
              {patientName && ` for ${patientName}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Print Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Print Options</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={handleRegularPrint}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Printer className="w-6 h-6" />
                  <span>Regular Print</span>
                  <span className="text-xs text-muted-foreground">Standard printing with current settings</span>
                </Button>

                <Button 
                  variant="outline"
                  onClick={() => setShowCustomPrint(true)}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Settings className="w-6 h-6" />
                  <span>Custom Print</span>
                  <span className="text-xs text-muted-foreground">Select specific tests & options</span>
                </Button>
              </CardContent>
            </Card>

            {/* Digital Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Digital Sharing</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline"
                  onClick={handleDownloadPDF}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Download className="w-6 h-6" />
                  <span>Download PDF</span>
                  <span className="text-xs text-muted-foreground">Save as PDF file</span>
                </Button>

                <Button 
                  variant="outline"
                  onClick={handleWhatsAppShare}
                  className="h-auto p-4 flex flex-col items-center gap-2 bg-green-50 hover:bg-green-100 border-green-200"
                >
                  <MessageSquare className="w-6 h-6 text-green-600" />
                  <span>WhatsApp Share</span>
                  <span className="text-xs text-muted-foreground">Send via WhatsApp</span>
                </Button>

                <Button 
                  variant="outline"
                  onClick={handleSMSShare}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <MessageSquare className="w-6 h-6" />
                  <span>SMS Link</span>
                  <span className="text-xs text-muted-foreground">Send download link via SMS</span>
                </Button>

                <Button 
                  variant="outline"
                  onClick={handleEmailShare}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Mail className="w-6 h-6" />
                  <span>Email</span>
                  <span className="text-xs text-muted-foreground">Send via email</span>
                </Button>
              </CardContent>
            </Card>

            {/* Document Preview Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Document Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Document Type:</span>
                  <Badge variant="secondary">{getDocumentTitle()}</Badge>
                </div>
                
                {patientName && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Patient:</span>
                    <span className="font-medium">{patientName}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Print Quality:</span>
                  <span className="font-medium">High (600 DPI)</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Page Size:</span>
                  <span className="font-medium">A4</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Settings */}
            <div className="flex justify-between items-center pt-4 border-t">
              <Button 
                variant="ghost" 
                onClick={() => setShowPrintSettings(true)}
                className="text-sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Print Settings
              </Button>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleRegularPrint}>
                  Print Now
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom Print Modal */}
      {showCustomPrint && (
        <CustomPrint
          isOpen={showCustomPrint}
          onClose={() => setShowCustomPrint(false)}
          availableTests={mockTests}
          onPrint={handleCustomPrintOptions}
        />
      )}

      {/* Print Settings Modal */}
      {showPrintSettings && (
        <PrintSettings
          isOpen={showPrintSettings}
          onClose={() => setShowPrintSettings(false)}
          settings={printSettings}
          onSave={(newSettings) => {
            setPrintSettings(newSettings);
            setShowPrintSettings(false);
          }}
        />
      )}
    </>
  );
}