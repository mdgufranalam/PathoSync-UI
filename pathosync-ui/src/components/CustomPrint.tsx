import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';

interface Test {
  id: string;
  name: string;
  selected: boolean;
}

interface CustomPrintOptions {
  selectAllTests: boolean;
  tests: Test[];
  includeHeaderFooter: boolean;
  includeSignatures: boolean;
  signaturesOnlyLastPage: boolean;
}

interface CustomPrintProps {
  isOpen: boolean;
  onClose: () => void;
  availableTests: Test[];
  onPrint: (options: CustomPrintOptions) => void;
}

export function CustomPrint({ isOpen, onClose, availableTests, onPrint }: CustomPrintProps) {
  const [options, setOptions] = useState<CustomPrintOptions>({
    selectAllTests: true,
    tests: availableTests.map(test => ({ ...test, selected: true })),
    includeHeaderFooter: false,
    includeSignatures: true,
    signaturesOnlyLastPage: false
  });

  const handleSelectAllTests = (checked: boolean) => {
    setOptions(prev => ({
      ...prev,
      selectAllTests: checked,
      tests: prev.tests.map(test => ({ ...test, selected: checked }))
    }));
  };

  const handleTestSelection = (testId: string, checked: boolean) => {
    setOptions(prev => {
      const updatedTests = prev.tests.map(test => 
        test.id === testId ? { ...test, selected: checked } : test
      );
      const allSelected = updatedTests.every(test => test.selected);
      return {
        ...prev,
        tests: updatedTests,
        selectAllTests: allSelected
      };
    });
  };

  const handleCustomPrint = () => {
    onPrint(options);
    onClose();
  };

  const handlePrintSettings = () => {
    // This would open the print settings dialog
    console.log('Open print settings');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Custom Print</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Select specific tests to include in your printed report
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Select the tests you want to print:
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="selectAll"
                  checked={options.selectAllTests}
                  onCheckedChange={handleSelectAllTests}
                />
                <label htmlFor="selectAll" className="text-sm font-medium">
                  Select All Tests
                </label>
              </div>

              <div className="ml-6 space-y-2">
                {options.tests.map((test) => (
                  <div key={test.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={test.id}
                      checked={test.selected}
                      onCheckedChange={(checked) => 
                        handleTestSelection(test.id, checked as boolean)
                      }
                    />
                    <label htmlFor={test.id} className="text-sm">
                      {test.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeHeader"
                checked={options.includeHeaderFooter}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({
                    ...prev,
                    includeHeaderFooter: checked as boolean
                  }))
                }
              />
              <label htmlFor="includeHeader" className="text-sm">
                Include Report Header and Footer Banners
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeSignatures"
                checked={options.includeSignatures}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({
                    ...prev,
                    includeSignatures: checked as boolean
                  }))
                }
              />
              <label htmlFor="includeSignatures" className="text-sm">
                Include Report Signatures
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="signaturesLastPage"
                checked={options.signaturesOnlyLastPage}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({
                    ...prev,
                    signaturesOnlyLastPage: checked as boolean
                  }))
                }
              />
              <label htmlFor="signaturesLastPage" className="text-sm">
                Include Report Signatures only in last page
              </label>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleCustomPrint}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              CUSTOM PRINT
            </Button>
            <Button 
              variant="outline" 
              onClick={handlePrintSettings}
              className="flex-1"
            >
              PRINT SETTINGS
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              CLOSE
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}