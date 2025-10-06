import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { RichTextEditor } from './ui/rich-text-editor';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Save,
  X,
  Plus,
  Trash2,
  FileText,
  Beaker,
  Microscope,
  TestTube
} from 'lucide-react';

interface AntibioticSensitivity {
  antibiotic: string;
  sensitive: boolean;
  intermediate: boolean;
  resistant: boolean;
}

interface DescriptiveTestData {
  testName: string;
  testType: 'culture' | 'microscopy' | 'biochemical' | 'molecular' | 'pathology';
  specimen: string;
  findings: string;
  impression: string;
  recommendations: string;
  antibiotics?: AntibioticSensitivity[];
  customTables?: Array<{
    name: string;
    headers: string[];
    rows: string[][];
  }>;
}

interface DescriptiveTestEditorProps {
  isOpen: boolean;
  onClose: () => void;
  testData?: DescriptiveTestData | null;
  onSave: (data: DescriptiveTestData) => void;
}

const defaultAntibiotics: AntibioticSensitivity[] = [
  { antibiotic: 'Penicillin (PG)', sensitive: false, intermediate: false, resistant: false },
  { antibiotic: 'Amoxicillin (AX)', sensitive: false, intermediate: false, resistant: false },
  { antibiotic: 'Amoxicillin-Clavulanic acid (AC)', sensitive: false, intermediate: false, resistant: false },
  { antibiotic: 'Co-trimoxazole (CT)', sensitive: false, intermediate: false, resistant: false },
  { antibiotic: 'Cephalexin (CP)', sensitive: false, intermediate: false, resistant: false },
  { antibiotic: 'Cefazolin(CR)', sensitive: false, intermediate: false, resistant: false },
  { antibiotic: 'Cefuroxime (CF)', sensitive: false, intermediate: false, resistant: false },
  { antibiotic: 'Erythromycin (ER)', sensitive: false, intermediate: false, resistant: false },
  { antibiotic: 'Chloramphenicol (CK)', sensitive: false, intermediate: false, resistant: false },
  { antibiotic: 'Ciprofloxin (CL)', sensitive: false, intermediate: false, resistant: false },
  { antibiotic: 'Ofloxacin (OF)', sensitive: false, intermediate: false, resistant: false },
  { antibiotic: 'Piperacillin (PC)', sensitive: false, intermediate: false, resistant: false },
  { antibiotic: 'Azithromycin (AZ)', sensitive: false, intermediate: false, resistant: false },
  { antibiotic: 'Tetracycline (TE)', sensitive: false, intermediate: false, resistant: false }
];

export function DescriptiveTestEditor({ isOpen, onClose, testData, onSave }: DescriptiveTestEditorProps) {
  const [currentData, setCurrentData] = useState<DescriptiveTestData>({
    testName: testData?.testName || 'Urine Culture & Sensitivity',
    testType: testData?.testType || 'culture',
    specimen: testData?.specimen || 'Urine',
    findings: testData?.findings || 'Staphylococcus Culture yields growth of Non fermenting gram Positive bacilli',
    impression: testData?.impression || '',
    recommendations: testData?.recommendations || '',
    antibiotics: testData?.antibiotics || [...defaultAntibiotics],
    customTables: testData?.customTables || []
  });

  const [activeTab, setActiveTab] = useState('main');

  const handleAntibioticChange = (index: number, field: keyof AntibioticSensitivity, value: boolean) => {
    const updatedAntibiotics = [...(currentData.antibiotics || [])];
    
    // Reset all fields for this antibiotic first
    updatedAntibiotics[index] = {
      ...updatedAntibiotics[index],
      sensitive: false,
      intermediate: false,
      resistant: false
    };
    
    // Set the selected field
    updatedAntibiotics[index][field] = value;
    
    setCurrentData({
      ...currentData,
      antibiotics: updatedAntibiotics
    });
  };

  const handleSave = () => {
    onSave(currentData);
    onClose();
  };

  const addCustomTable = () => {
    const newTable = {
      name: 'Custom Table',
      headers: ['Parameter', 'Result', 'Reference'],
      rows: [['', '', '']]
    };
    
    setCurrentData({
      ...currentData,
      customTables: [...(currentData.customTables || []), newTable]
    });
  };

  const getTestIcon = (type: string) => {
    switch (type) {
      case 'culture': return <Beaker className="w-4 h-4" />;
      case 'microscopy': return <Microscope className="w-4 h-4" />;
      case 'biochemical': return <TestTube className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTestIcon(currentData.testType)}
            Descriptive Test Editor - {currentData.testName}
          </DialogTitle>
          <DialogDescription>
            Edit descriptive test content with rich formatting and specialized tables
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="main">Main Content</TabsTrigger>
            <TabsTrigger value="culture">Culture & Sensitivity</TabsTrigger>
            <TabsTrigger value="tables">Custom Tables</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="main" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Test Type</Label>
                <Select 
                  value={currentData.testType} 
                  onValueChange={(value: any) => setCurrentData({...currentData, testType: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="culture">Culture & Sensitivity</SelectItem>
                    <SelectItem value="microscopy">Microscopy</SelectItem>
                    <SelectItem value="biochemical">Biochemical Analysis</SelectItem>
                    <SelectItem value="molecular">Molecular Testing</SelectItem>
                    <SelectItem value="pathology">Histopathology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Specimen Type</Label>
                <Input 
                  value={currentData.specimen}
                  onChange={(e) => setCurrentData({...currentData, specimen: e.target.value})}
                  placeholder="e.g., Urine, Blood, Tissue"
                />
              </div>
            </div>

            <div>
              <Label>Clinical Findings</Label>
              <RichTextEditor
                value={currentData.findings}
                onChange={(value) => setCurrentData({...currentData, findings: value})}
                placeholder="Enter detailed clinical findings and observations..."
                className="min-h-[200px]"
              />
            </div>

            <div>
              <Label>Clinical Impression</Label>
              <Textarea
                value={currentData.impression}
                onChange={(e) => setCurrentData({...currentData, impression: e.target.value})}
                placeholder="Enter clinical impression and diagnosis..."
                rows={3}
              />
            </div>

            <div>
              <Label>Recommendations</Label>
              <Textarea
                value={currentData.recommendations}
                onChange={(e) => setCurrentData({...currentData, recommendations: e.target.value})}
                placeholder="Enter treatment recommendations and follow-up instructions..."
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="culture" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="flex items-center gap-2">
                  <Beaker className="w-4 h-4" />
                  Antibiotic Sensitivity Testing
                </h4>
                <Badge variant="outline">Culture Results</Badge>
              </div>
              
              <div className="mb-4">
                <Label>Organism Culture</Label>
                <RichTextEditor
                  value={currentData.findings}
                  onChange={(value) => setCurrentData({...currentData, findings: value})}
                  placeholder="Organism Culture: Staphylococcus Culture yields growth of Non fermenting gram Positive bacilli"
                  className="min-h-[80px]"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/2">Antibiotics</TableHead>
                    <TableHead className="text-center">Sensitive</TableHead>
                    <TableHead className="text-center">Intermediate</TableHead>
                    <TableHead className="text-center">Resistant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.antibiotics?.map((antibiotic, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-blue-600">
                        {antibiotic.antibiotic}
                      </TableCell>
                      <TableCell className="text-center">
                        <input
                          type="radio"
                          name={`antibiotic-${index}`}
                          checked={antibiotic.sensitive}
                          onChange={(e) => handleAntibioticChange(index, 'sensitive', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <input
                          type="radio"
                          name={`antibiotic-${index}`}
                          checked={antibiotic.intermediate}
                          onChange={(e) => handleAntibioticChange(index, 'intermediate', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <input
                          type="radio"
                          name={`antibiotic-${index}`}
                          checked={antibiotic.resistant}
                          onChange={(e) => handleAntibioticChange(index, 'resistant', e.target.checked)}
                          className="w-4 h-4"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="tables" className="space-y-4">
            <div className="flex items-center justify-between">
              <h4>Custom Data Tables</h4>
              <Button onClick={addCustomTable} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Table
              </Button>
            </div>
            
            {currentData.customTables?.map((table, tableIndex) => (
              <Card key={tableIndex} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Input
                    value={table.name}
                    onChange={(e) => {
                      const updatedTables = [...(currentData.customTables || [])];
                      updatedTables[tableIndex].name = e.target.value;
                      setCurrentData({...currentData, customTables: updatedTables});
                    }}
                    placeholder="Table Name"
                    className="font-medium"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      const updatedTables = currentData.customTables?.filter((_, i) => i !== tableIndex);
                      setCurrentData({...currentData, customTables: updatedTables});
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      {table.headers.map((header, headerIndex) => (
                        <TableHead key={headerIndex}>
                          <Input
                            value={header}
                            onChange={(e) => {
                              const updatedTables = [...(currentData.customTables || [])];
                              updatedTables[tableIndex].headers[headerIndex] = e.target.value;
                              setCurrentData({...currentData, customTables: updatedTables});
                            }}
                            placeholder={`Column ${headerIndex + 1}`}
                          />
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {table.rows.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <TableCell key={cellIndex}>
                            <Input
                              value={cell}
                              onChange={(e) => {
                                const updatedTables = [...(currentData.customTables || [])];
                                updatedTables[tableIndex].rows[rowIndex][cellIndex] = e.target.value;
                                setCurrentData({...currentData, customTables: updatedTables});
                              }}
                              placeholder="Enter value"
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{currentData.testName}</h3>
                  <Badge variant="outline">{currentData.testType}</Badge>
                </div>
                
                <div>
                  <Label className="font-medium">Specimen:</Label>
                  <p>{currentData.specimen}</p>
                </div>
                
                <div>
                  <Label className="font-medium">Findings:</Label>
                  <div 
                    className="prose max-w-none mt-2 p-3 border rounded"
                    dangerouslySetInnerHTML={{ __html: currentData.findings }}
                  />
                </div>

                {currentData.antibiotics && (
                  <div>
                    <Label className="font-medium">Antibiotic Sensitivity:</Label>
                    <Table className="mt-2">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Antibiotics</TableHead>
                          <TableHead>Sensitive</TableHead>
                          <TableHead>Intermediate</TableHead>
                          <TableHead>Resistant</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentData.antibiotics.map((antibiotic, index) => (
                          <TableRow key={index}>
                            <TableCell>{antibiotic.antibiotic}</TableCell>
                            <TableCell>{antibiotic.sensitive ? '✓' : ''}</TableCell>
                            <TableCell>{antibiotic.intermediate ? '✓' : ''}</TableCell>
                            <TableCell>{antibiotic.resistant ? '✓' : ''}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                {currentData.impression && (
                  <div>
                    <Label className="font-medium">Impression:</Label>
                    <p className="mt-1">{currentData.impression}</p>
                  </div>
                )}
                
                {currentData.recommendations && (
                  <div>
                    <Label className="font-medium">Recommendations:</Label>
                    <p className="mt-1">{currentData.recommendations}</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}