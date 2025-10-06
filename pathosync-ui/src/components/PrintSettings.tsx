import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Settings, 
  FileText, 
  Signature, 
  Receipt, 
  Plus, 
  Trash2,
  Upload
} from 'lucide-react';

interface PrintSettings {
  basicSettings: {
    printEachDepartmentInNewPage: boolean;
    numberOfLinesInOnePage: number;
    fontSize: number;
    spaceBetweenLines: number;
  };
  letterhead: {
    enabled: boolean;
    logoUrl: string;
    clinicName: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    registrationNumber: string;
  };
  signatures: {
    useSignaturesOnlyInLastPage: boolean;
    signatures: Array<{
      id: string;
      name: string;
      designation: string;
      signatureUrl: string;
    }>;
  };
  billPrint: {
    showHeader: boolean;
    showFooter: boolean;
    showBankDetails: boolean;
    showTermsConditions: boolean;
  };
}

interface PrintSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PrintSettings;
  onSave: (settings: PrintSettings) => void;
}

export function PrintSettings({ isOpen, onClose, settings, onSave }: PrintSettingsProps) {
  const [localSettings, setLocalSettings] = useState<PrintSettings>(settings);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const addSignature = () => {
    const newSignature = {
      id: `sig-${Date.now()}`,
      name: '',
      designation: '',
      signatureUrl: ''
    };
    setLocalSettings(prev => ({
      ...prev,
      signatures: {
        ...prev.signatures,
        signatures: [...prev.signatures.signatures, newSignature]
      }
    }));
  };

  const removeSignature = (id: string) => {
    setLocalSettings(prev => ({
      ...prev,
      signatures: {
        ...prev.signatures,
        signatures: prev.signatures.signatures.filter(sig => sig.id !== id)
      }
    }));
  };

  const updateSignature = (id: string, field: string, value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      signatures: {
        ...prev.signatures,
        signatures: prev.signatures.signatures.map(sig => 
          sig.id === id ? { ...sig, [field]: value } : sig
        )
      }
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="bg-blue-600 text-white px-6 py-4 -mx-6 -mt-6 mb-6">
            <DialogTitle className="text-white text-center">Print Settings</DialogTitle>
            <DialogDescription className="text-blue-100 text-center mt-2">
              Configure global print settings for all reports and documents
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid grid-cols-4 w-full mb-6">
              <TabsTrigger value="basic">BASIC SETTINGS</TabsTrigger>
              <TabsTrigger value="letterhead">LETTERHEAD</TabsTrigger>
              <TabsTrigger value="signature">SIGNATURE</TabsTrigger>
              <TabsTrigger value="bill">BILL PRINT</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="printEachDept"
                      checked={localSettings.basicSettings.printEachDepartmentInNewPage}
                      onCheckedChange={(checked) => 
                        setLocalSettings(prev => ({
                          ...prev,
                          basicSettings: {
                            ...prev.basicSettings,
                            printEachDepartmentInNewPage: checked as boolean
                          }
                        }))
                      }
                    />
                    <label htmlFor="printEachDept" className="text-sm font-medium">
                      Print each Department in new page
                    </label>
                  </div>

                  <div>
                    <Label className="text-orange-600">Number of Lines in 1 Page of Printout</Label>
                    <Input
                      type="number"
                      value={localSettings.basicSettings.numberOfLinesInOnePage}
                      onChange={(e) => 
                        setLocalSettings(prev => ({
                          ...prev,
                          basicSettings: {
                            ...prev.basicSettings,
                            numberOfLinesInOnePage: parseInt(e.target.value) || 20
                          }
                        }))
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-orange-600">Font Size</Label>
                    <Select
                      value={localSettings.basicSettings.fontSize.toString()}
                      onValueChange={(value) => 
                        setLocalSettings(prev => ({
                          ...prev,
                          basicSettings: {
                            ...prev.basicSettings,
                            fontSize: parseFloat(value)
                          }
                        }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.6">0.6</SelectItem>
                        <SelectItem value="0.7">0.7</SelectItem>
                        <SelectItem value="0.8">0.8</SelectItem>
                        <SelectItem value="0.9">0.9</SelectItem>
                        <SelectItem value="1.0">1.0</SelectItem>
                        <SelectItem value="1.1">1.1</SelectItem>
                        <SelectItem value="1.2">1.2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-orange-600">Space between lines</Label>
                    <Select
                      value={localSettings.basicSettings.spaceBetweenLines.toString()}
                      onValueChange={(value) => 
                        setLocalSettings(prev => ({
                          ...prev,
                          basicSettings: {
                            ...prev.basicSettings,
                            spaceBetweenLines: parseFloat(value)
                          }
                        }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.0">0.0</SelectItem>
                        <SelectItem value="0.1">0.1</SelectItem>
                        <SelectItem value="0.2">0.2</SelectItem>
                        <SelectItem value="0.3">0.3</SelectItem>
                        <SelectItem value="0.4">0.4</SelectItem>
                        <SelectItem value="0.5">0.5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="letterhead" className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="enableLetterhead"
                      checked={localSettings.letterhead.enabled}
                      onCheckedChange={(checked) => 
                        setLocalSettings(prev => ({
                          ...prev,
                          letterhead: {
                            ...prev.letterhead,
                            enabled: checked as boolean
                          }
                        }))
                      }
                    />
                    <label htmlFor="enableLetterhead" className="text-sm font-medium">
                      Enable Custom Letterhead
                    </label>
                  </div>

                  {localSettings.letterhead.enabled && (
                    <>
                      <div>
                        <Label>Clinic/Lab Logo</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            type="file"
                            accept="image/*"
                            className="flex-1"
                          />
                          <Button variant="outline" size="sm">
                            <Upload className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Clinic/Lab Name</Label>
                          <Input
                            value={localSettings.letterhead.clinicName}
                            onChange={(e) => 
                              setLocalSettings(prev => ({
                                ...prev,
                                letterhead: {
                                  ...prev.letterhead,
                                  clinicName: e.target.value
                                }
                              }))
                            }
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label>Registration Number</Label>
                          <Input
                            value={localSettings.letterhead.registrationNumber}
                            onChange={(e) => 
                              setLocalSettings(prev => ({
                                ...prev,
                                letterhead: {
                                  ...prev.letterhead,
                                  registrationNumber: e.target.value
                                }
                              }))
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Address</Label>
                        <Textarea
                          value={localSettings.letterhead.address}
                          onChange={(e) => 
                            setLocalSettings(prev => ({
                              ...prev,
                              letterhead: {
                                ...prev.letterhead,
                                address: e.target.value
                              }
                            }))
                          }
                          className="mt-1"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Phone</Label>
                          <Input
                            value={localSettings.letterhead.phone}
                            onChange={(e) => 
                              setLocalSettings(prev => ({
                                ...prev,
                                letterhead: {
                                  ...prev.letterhead,
                                  phone: e.target.value
                                }
                              }))
                            }
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label>Email</Label>
                          <Input
                            value={localSettings.letterhead.email}
                            onChange={(e) => 
                              setLocalSettings(prev => ({
                                ...prev,
                                letterhead: {
                                  ...prev.letterhead,
                                  email: e.target.value
                                }
                              }))
                            }
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label>Website</Label>
                          <Input
                            value={localSettings.letterhead.website}
                            onChange={(e) => 
                              setLocalSettings(prev => ({
                                ...prev,
                                letterhead: {
                                  ...prev.letterhead,
                                  website: e.target.value
                                }
                              }))
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signature" className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="signaturesLastPage"
                      checked={localSettings.signatures.useSignaturesOnlyInLastPage}
                      onCheckedChange={(checked) => 
                        setLocalSettings(prev => ({
                          ...prev,
                          signatures: {
                            ...prev.signatures,
                            useSignaturesOnlyInLastPage: checked as boolean
                          }
                        }))
                      }
                    />
                    <label htmlFor="signaturesLastPage" className="text-sm font-medium">
                      Use Signatures only in last page of printout.
                    </label>
                  </div>

                  <div className="space-y-4">
                    {localSettings.signatures.signatures.map((signature, index) => (
                      <div key={signature.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Signature No. {index + 1}</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeSignature(signature.id)}
                          >
                            REMOVE SIGNATURE
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Name</Label>
                            <Input
                              value={signature.name}
                              onChange={(e) => updateSignature(signature.id, 'name', e.target.value)}
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label>Designation</Label>
                            <Input
                              value={signature.designation}
                              onChange={(e) => updateSignature(signature.id, 'designation', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Signature Image</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              type="file"
                              accept="image/*"
                              className="flex-1"
                            />
                            <span className="text-sm text-muted-foreground">
                              {signature.signatureUrl ? 'File chosen' : 'No file chosen'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button onClick={addSignature} className="w-full bg-blue-600 hover:bg-blue-700">
                      ADD SIGNATURE
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bill" className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="showBillHeader"
                        checked={localSettings.billPrint.showHeader}
                        onCheckedChange={(checked) => 
                          setLocalSettings(prev => ({
                            ...prev,
                            billPrint: {
                              ...prev.billPrint,
                              showHeader: checked as boolean
                            }
                          }))
                        }
                      />
                      <label htmlFor="showBillHeader" className="text-sm font-medium">
                        Show Header in Bill Print
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="showBillFooter"
                        checked={localSettings.billPrint.showFooter}
                        onCheckedChange={(checked) => 
                          setLocalSettings(prev => ({
                            ...prev,
                            billPrint: {
                              ...prev.billPrint,
                              showFooter: checked as boolean
                            }
                          }))
                        }
                      />
                      <label htmlFor="showBillFooter" className="text-sm font-medium">
                        Show Footer in Bill Print
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="showBankDetails"
                        checked={localSettings.billPrint.showBankDetails}
                        onCheckedChange={(checked) => 
                          setLocalSettings(prev => ({
                            ...prev,
                            billPrint: {
                              ...prev.billPrint,
                              showBankDetails: checked as boolean
                            }
                          }))
                        }
                      />
                      <label htmlFor="showBankDetails" className="text-sm font-medium">
                        Show Bank Details
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="showTerms"
                        checked={localSettings.billPrint.showTermsConditions}
                        onCheckedChange={(checked) => 
                          setLocalSettings(prev => ({
                            ...prev,
                            billPrint: {
                              ...prev.billPrint,
                              showTermsConditions: checked as boolean
                            }
                          }))
                        }
                      />
                      <label htmlFor="showTerms" className="text-sm font-medium">
                        Show Terms & Conditions
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            BACK
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            EDIT SETTINGS
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}