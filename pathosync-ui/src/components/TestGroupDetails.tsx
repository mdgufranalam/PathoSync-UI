import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { 
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Move,
  PlayCircle,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface SubTest {
  id: string;
  name: string;
  price: number;
  type: 'Normal Test' | 'Descriptive Test';
  unit?: string;
  referenceRange?: string;
}

interface TestGroup {
  id: string;
  name: string;
  price: number;
  category: string;
  subTests: SubTest[];
  description?: string;
}

interface TestGroupDetailsProps {
  testGroup: TestGroup | null;
  onBack: () => void;
  onSave: (testGroup: TestGroup) => void;
  availableTests: SubTest[];
}

export function TestGroupDetails({ testGroup, onBack, onSave, availableTests }: TestGroupDetailsProps) {
  const [isAddTestModalOpen, setIsAddTestModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [editingGroup, setEditingGroup] = useState<TestGroup | null>(testGroup);

  if (!testGroup || !editingGroup) {
    return null;
  }

  const handleAddSubTests = () => {
    if (selectedTests.length === 0) return;
    
    const testsToAdd = availableTests.filter(test => selectedTests.includes(test.id));
    setEditingGroup(prev => prev ? {
      ...prev,
      subTests: [...prev.subTests, ...testsToAdd]
    } : null);
    
    setSelectedTests([]);
    setIsAddTestModalOpen(false);
  };

  const handleRemoveSubTest = (testId: string) => {
    setEditingGroup(prev => prev ? {
      ...prev,
      subTests: prev.subTests.filter(test => test.id !== testId)
    } : null);
  };

  const handleSave = () => {
    if (editingGroup) {
      onSave(editingGroup);
    }
  };

  const breadcrumb = (
    <div className="flex items-center gap-2 text-blue-600 mb-6">
      <span className="cursor-pointer hover:underline">All</span>
      <ChevronRight className="w-4 h-4" />
      <span className="cursor-pointer hover:underline">{testGroup.category}</span>
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-600">{testGroup.name}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Blue Header */}
      <div className="bg-blue-600 text-white py-4">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-xl text-center">Tests</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {breadcrumb}

        {/* Test Group Header */}
        <div className="mb-6">
          <h1 className="text-3xl text-gray-600 mb-2">{editingGroup.name}</h1>
          <p className="text-2xl text-gray-600 mb-4">₹{editingGroup.price}</p>
          <Badge className="bg-pink-500 text-white px-4 py-1 text-sm">
            Test Group
          </Badge>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-gray-600 text-lg">
            This is a test group containing the following Sub Tests:
          </p>
        </div>

        {/* Sub Tests List */}
        <div className="space-y-3 mb-8">
          {editingGroup.subTests.map((subTest, index) => (
            <motion.div
              key={subTest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                {/* Test Icon */}
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm">
                  IIa
                </div>
                
                {/* Test Details */}
                <div>
                  <h3 className="text-gray-800 mb-1">{subTest.name}</h3>
                  <p className="text-gray-500 text-sm">₹{subTest.price}</p>
                </div>
              </div>

              {/* Test Type Badge */}
              <div className="flex items-center gap-3">
                <Badge className="bg-teal-500 text-white px-3 py-1">
                  Normal Test
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveSubTest(subTest.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
          <Button 
            onClick={() => setIsAddTestModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-6"
          >
            ADD SUB TEST
          </Button>
          
          <Button 
            onClick={() => setIsEditModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6"
          >
            EDIT
          </Button>
          
          <Button 
            variant="outline"
            className="border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white px-6"
          >
            RE-ARRANGE
          </Button>
          
          <Button 
            variant="outline"
            className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-6"
          >
            VIDEO TUTORIAL
          </Button>
          
          <Button 
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-6"
          >
            DELETE
          </Button>
        </div>

        {/* Back Button */}
        <Button 
          onClick={onBack}
          variant="ghost"
          className="mt-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tests
        </Button>
      </div>

      {/* Add Sub Test Modal */}
      <Dialog open={isAddTestModalOpen} onOpenChange={setIsAddTestModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Sub Tests</DialogTitle>
            <DialogDescription>
              Select tests to add to this test group
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="max-h-96 overflow-y-auto space-y-2">
              {availableTests.filter(test => 
                !editingGroup.subTests.some(subTest => subTest.id === test.id)
              ).map((test) => (
                <div key={test.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <input
                    type="checkbox"
                    id={test.id}
                    checked={selectedTests.includes(test.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTests(prev => [...prev, test.id]);
                      } else {
                        setSelectedTests(prev => prev.filter(id => id !== test.id));
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <label htmlFor={test.id} className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{test.name}</p>
                        <p className="text-sm text-gray-500">{test.type}</p>
                      </div>
                      <p className="text-sm text-gray-600">₹{test.price}</p>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleAddSubTests}
                disabled={selectedTests.length === 0}
              >
                Add Selected Tests ({selectedTests.length})
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddTestModalOpen(false);
                  setSelectedTests([]);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Test Group Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Test Group</DialogTitle>
            <DialogDescription>
              Update test group information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Test Group Name</Label>
              <Input
                id="groupName"
                value={editingGroup.name}
                onChange={(e) => setEditingGroup(prev => prev ? {...prev, name: e.target.value} : null)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupPrice">Price</Label>
              <Input
                id="groupPrice"
                type="number"
                value={editingGroup.price}
                onChange={(e) => setEditingGroup(prev => prev ? {...prev, price: parseFloat(e.target.value) || 0} : null)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupCategory">Category</Label>
              <Select
                value={editingGroup.category}
                onValueChange={(value) => setEditingGroup(prev => prev ? {...prev, category: value} : null)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Biochemistry">Biochemistry</SelectItem>
                  <SelectItem value="Hematology">Hematology</SelectItem>
                  <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                  <SelectItem value="Microbiology">Microbiology</SelectItem>
                  <SelectItem value="Immunology">Immunology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupDescription">Description (Optional)</Label>
              <Textarea
                id="groupDescription"
                value={editingGroup.description || ''}
                onChange={(e) => setEditingGroup(prev => prev ? {...prev, description: e.target.value} : null)}
                placeholder="Enter description for this test group..."
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={() => {
                handleSave();
                setIsEditModalOpen(false);
              }}>
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}