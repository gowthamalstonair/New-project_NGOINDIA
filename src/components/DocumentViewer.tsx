import React from 'react';
import { ArrowLeft, Download, Eye, FileText, Share2, Bookmark } from 'lucide-react';

interface DocumentViewerProps {
  documentId: string;
  onBack: () => void;
}

export function DocumentViewer({ documentId, onBack }: DocumentViewerProps): JSX.Element {
  const getDocumentById = (id: string) => {
    const savedDocs = localStorage.getItem('ngoDocuments');
    const documents = savedDocs ? JSON.parse(savedDocs) : [];
    return documents.find((doc: any) => doc.id === id) || null;
  };

  const doc = getDocumentById(documentId);

  if (!doc) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Document not found</h3>
          <p className="text-gray-600 mb-4">The requested document could not be found.</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    const fileName = doc.title.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf';
    const pdfContent = `%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(${doc.title}) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000204 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n297\n%%EOF`;
    
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: doc.title,
        text: doc.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Document link copied to clipboard!');
    }
  };

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedDocuments') || '[]');
    const isBookmarked = bookmarks.includes(doc.id);
    
    if (isBookmarked) {
      const updated = bookmarks.filter((id: string) => id !== doc.id);
      localStorage.setItem('bookmarkedDocuments', JSON.stringify(updated));
      alert('Document removed from bookmarks!');
    } else {
      bookmarks.push(doc.id);
      localStorage.setItem('bookmarkedDocuments', JSON.stringify(bookmarks));
      alert('Document bookmarked!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-600"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Library
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{doc.title}</h1>
                <p className="text-gray-600">{doc.ngoName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Share document"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button 
                onClick={handleBookmark}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Bookmark document"
              >
                <Bookmark className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <img
                src={doc.image}
                alt={doc.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Document Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{doc.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pages:</span>
                      <span className="font-medium">{doc.pages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{doc.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Published:</span>
                      <span className="font-medium">{new Date(doc.uploadDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Engagement</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <span>{doc.views.toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-gray-400" />
                      <span>{doc.downloads.toLocaleString()} downloads</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {doc.tags.map((tag: string, index: number) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="prose max-w-none">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">About this Document</h2>
                  <p className="text-gray-600">{doc.description}</p>
                </div>
                
                <div className="document-content">
                  <p>{doc.content || 'This document contains detailed information about ' + doc.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}