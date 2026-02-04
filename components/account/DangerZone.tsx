'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Download, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function DangerZone() {
    const router = useRouter();
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const handleExportData = async () => {
        setIsExporting(true);
        try {
            const response = await fetch('/api/account/export');
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `padhloyaar-data-${Date.now()}.json`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                alert('Failed to export data');
            }
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export data');
        } finally {
            setIsExporting(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== 'DELETE') {
            alert('Please type DELETE to confirm');
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch('/api/account/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ confirmation: 'DELETE' }),
            });

            if (response.ok) {
                alert('Account deleted successfully. Redirecting...');
                router.push('/login');
            } else {
                alert('Failed to delete account');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete account');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card className="p-6 border-destructive">
            <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <h3 className="font-semibold text-lg">Danger Zone</h3>
            </div>

            <div className="space-y-4">
                {/* Export Data */}
                <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                        <h4 className="font-medium">Export Your Data</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                            Download all your data in JSON format (GDPR compliant)
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportData}
                        disabled={isExporting}
                        className="ml-4"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        {isExporting ? 'Exporting...' : 'Export'}
                    </Button>
                </div>

                {/* Delete Account */}
                <div className="flex items-start justify-between p-4 border border-destructive rounded-lg bg-destructive/5">
                    <div className="flex-1">
                        <h4 className="font-medium text-destructive">Delete Account</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                            Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                    </div>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="ml-4"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove all your data from our servers, including:
                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                        <li>Profile and account information</li>
                                        <li>Saved history and content</li>
                                        <li>Usage statistics</li>
                                        <li>Active subscriptions (will be canceled)</li>
                                    </ul>
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <div className="my-4">
                                <label className="text-sm font-medium">
                                    Type <span className="font-mono bg-muted px-1">DELETE</span> to confirm
                                </label>
                                <Input
                                    value={deleteConfirmation}
                                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                                    placeholder="DELETE"
                                    className="mt-2"
                                />
                            </div>

                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDeleteConfirmation('')}>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirmation !== 'DELETE' || isDeleting}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Account'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </Card>
    );
}
