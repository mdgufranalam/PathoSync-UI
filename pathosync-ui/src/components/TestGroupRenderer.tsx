import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Layers, TestTube, FileText } from 'lucide-react';

interface ReferenceRange {
  id: string;
  name: string;
  minValue: string;
  maxValue: string;
  unit: string;
}

interface Test {
  id: string;
  testType: 'Normal Test' | 'Descriptive Test' | 'Test Group';
  testName: string;
  shortCode: string;
  price: number;
  unit?: string;
  tag: string;
  method?: string;
  formula?: string;
  notes?: string;
  defaultLabResult?: string;
  referenceRanges?: ReferenceRange[];
  subTests?: Test[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TestResult {
  testId: string;
  testName: string;
  result: string;
  unit?: string;
  referenceRange?: string;
  method?: string;
  status?: 'Normal' | 'High' | 'Low' | 'Critical';
  isAbnormal?: boolean;
}

interface TestGroupRendererProps {
  test: Test;
  testResults?: TestResult[];
  isEditing?: boolean;
  onResultChange?: (testId: string, result: string) => void;
}

export function TestGroupRenderer({ test, testResults = [], isEditing = false, onResultChange }: TestGroupRendererProps) {
  
  const getTestResult = (testId: string) => {
    return testResults.find(tr => tr.testId === testId)?.result || '';
  };

  const formatReferenceRange = (ranges?: ReferenceRange[]) => {
    if (!ranges || ranges.length === 0) return '';
    return ranges.map(range => 
      `${range.name}: ${range.minValue} - ${range.maxValue} ${range.unit}`
    ).join('\n');
  };

  const getTestIcon = (testType: string) => {
    switch (testType) {
      case 'Normal Test': return <TestTube className="w-4 h-4 text-blue-600" />;
      case 'Test Group': return <Layers className="w-4 h-4 text-green-600" />;
      case 'Descriptive Test': return <FileText className="w-4 h-4 text-purple-600" />;
      default: return <TestTube className="w-4 h-4" />;
    }
  };

  const renderSubTest = (subTest: Test, depth = 0) => {
    const marginLeft = depth * 20;
    
    if (subTest.testType === 'Test Group' && subTest.subTests) {
      return (
        <React.Fragment key={subTest.id}>
          {/* Test Group Header */}
          <TableRow className="bg-gray-50">
            <TableCell style={{ paddingLeft: `${marginLeft + 16}px` }}>
              <div className="flex items-center gap-2">
                {getTestIcon(subTest.testType)}
                <span className="font-medium text-gray-700">{subTest.testName}</span>
                <Badge variant="outline" className="text-xs">
                  {subTest.subTests.length} tests
                </Badge>
              </div>
              {subTest.notes && (
                <p className="text-xs text-gray-500 mt-1">{subTest.notes}</p>
              )}
            </TableCell>
            <TableCell className="text-gray-400">-</TableCell>
            <TableCell className="text-gray-400">-</TableCell>
            <TableCell className="text-gray-400">-</TableCell>
          </TableRow>
          
          {/* Sub-tests */}
          {subTest.subTests.map(nestedSubTest => renderSubTest(nestedSubTest, depth + 1))}
        </React.Fragment>
      );
    } else {
      // Normal Test or Descriptive Test
      const result = getTestResult(subTest.id);
      const referenceRange = formatReferenceRange(subTest.referenceRanges);
      
      return (
        <TableRow key={subTest.id}>
          <TableCell style={{ paddingLeft: `${marginLeft + 16}px` }}>
            <div className="flex items-center gap-2">
              {getTestIcon(subTest.testType)}
              <span>{subTest.testName}</span>
              {subTest.shortCode && (
                <Badge variant="outline" className="text-xs">
                  {subTest.shortCode}
                </Badge>
              )}
            </div>
            {subTest.method && (
              <p className="text-xs text-gray-500 mt-1">Method: {subTest.method}</p>
            )}
            {subTest.notes && (
              <p className="text-xs text-gray-500 mt-1">{subTest.notes}</p>
            )}
          </TableCell>
          <TableCell>
            {isEditing ? (
              <input
                type="text"
                value={result}
                onChange={(e) => onResultChange?.(subTest.id, e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="Enter result"
              />
            ) : (
              <span className={result ? 'font-medium' : 'text-gray-400'}>
                {result || 'Pending'}
              </span>
            )}
          </TableCell>
          <TableCell className="text-sm">
            {subTest.unit || '-'}
          </TableCell>
          <TableCell className="text-sm whitespace-pre-line">
            {referenceRange || '-'}
          </TableCell>
        </TableRow>
      );
    }
  };

  if (!test.subTests || test.subTests.length === 0) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {getTestIcon(test.testType)}
            <h3 className="font-medium">{test.testName}</h3>
            <Badge variant="outline">No sub-tests</Badge>
          </div>
          <p className="text-sm text-gray-500">This test group has no sub-tests configured.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-0">
        {/* Test Group Header */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            {getTestIcon(test.testType)}
            <h3 className="font-medium text-lg">{test.testName}</h3>
            <Badge className="bg-green-100 text-green-800">
              {test.subTests.length} sub-tests
            </Badge>
          </div>
          {test.notes && (
            <p className="text-sm text-gray-600 mt-2">{test.notes}</p>
          )}
        </div>
        
        {/* Sub-tests Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test Name</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Reference Range</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {test.subTests.map(subTest => renderSubTest(subTest, 0))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}