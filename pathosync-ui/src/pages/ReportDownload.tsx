import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';

export function ReportDownloadPage() {
  const { reportId } = useParams();
  const [mobileNumber, setMobileNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      const response = await apiClient.post(`/public/reports/${reportId}/download`, 
        { mobileNumber },
        { responseType: 'blob' } 
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = window.URL.createObjectURL(blob);
      window.open(pdfUrl, '_blank');

      setMessage('Report opened in a new tab.');

    } catch (error: any) {
        if (error.response && error.response.data) {
            try {
                const errorText = await error.response.data.text();
                const errorJson = JSON.parse(errorText);
                setMessage(errorJson.message || 'An unexpected error occurred.');
            } catch (e) {
                setMessage('An unexpected error occurred while parsing the error response.');
            }
        } else {
            setMessage('An unexpected error occurred.');
        }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-[400px]">
            <CardHeader>
                <CardTitle>Download Your Report</CardTitle>
                <CardDescription>Enter the 10-digit mobile number associated with your report to download it.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input 
                        id="mobile" 
                        placeholder="Enter your mobile number" 
                        value={mobileNumber}
                        onChange={e => setMobileNumber(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                {message && <p className={`text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
            </CardContent>
            <CardFooter>
                <Button onClick={handleDownload} disabled={isLoading || !mobileNumber} className="w-full">
                    {isLoading ? 'Opening...' : 'Open Report'}
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}