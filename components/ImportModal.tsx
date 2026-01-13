import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { X, Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download, Loader } from 'lucide-react';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (data: any[]) => Promise<void>;
    type: 'Project' | 'Contract' | 'Customer' | 'Payment' | 'Employee';
}

const TEMPLATES = {
    Project: [
        { Code: 'P-001', Name: 'Dự án A', Client: 'Khách hàng X', Status: 'Đang thực hiện', Budget: 1000000000, Manager: 'Nguyễn Văn A' }
    ],
    Contract: [
        { Code: 'C-001', ProjectCode: 'P-001', PackageName: 'Gói thầu A', TotalValue: 500000000, SignedDate: '2025-01-01', Status: 'Hiệu lực' }
    ],
    Customer: [
        { Code: 'CUST-01', Name: 'Công ty ABC', Type: 'Client', Phone: '0909123456', Email: 'contact@abc.com', Address: 'Hà Nội' }
    ],
    Payment: [
        { ContractCode: 'C-001', InvoiceNumber: 'HD001', Description: 'Thanh toán đợt 1', Amount: 100000000, Date: '2025-02-01', Method: 'Transfer' }
    ],
    Employee: [
        {
            Code: 'CIC-001',
            Name: 'Nguyễn Văn A',
            Email: 'nguyenvana@cic.com.vn',
            Phone: '0909123456',
            Department: 'Kỹ thuật - BIM',
            Role: 'Kỹ sư BIM',
            JoinDate: '2024-01-15',
            Status: 'Chính thức',
            DOB: '01/01/1990',
            Degree: 'Kỹ sư Xây dựng - ĐH Bách Khoa',
            Skills: 'Revit, AutoCAD, Navisworks'
        }
    ]
};

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport, type }) => {
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDownloadTemplate = () => {
        const ws = XLSX.utils.json_to_sheet(TEMPLATES[type]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, `${type}_Template.xlsx`);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setMessage(null);

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                setPreviewData(data.slice(0, 5)); // Preview first 5 rows
            } catch (err) {
                setMessage({ type: 'error', text: 'Không thể đọc file. Vui lòng đảm bảo đúng định dạng Excel.' });
                setPreviewData([]);
            }
        };
        reader.readAsBinaryString(selectedFile);
    };

    const handleImport = async () => {
        if (!file || previewData.length === 0) return;

        setIsLoading(true);
        // Re-read full data
        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const fullData = XLSX.utils.sheet_to_json(ws);

                await onImport(fullData);
                setMessage({ type: 'success', text: `Đã import thành công ${fullData.length} dòng!` });
                setTimeout(() => {
                    onClose();
                    setFile(null);
                    setPreviewData([]);
                    setMessage(null);
                }, 1500);
            } catch (err) {
                setMessage({ type: 'error', text: 'Lỗi khi import dữ liệu.' });
            } finally {
                setIsLoading(false);
            }
        };
        reader.readAsBinaryString(file);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <Upload className="text-emerald-600" size={20} /> Import dữ liệu {type}
                    </h3>
                    <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Actions */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={handleDownloadTemplate}
                            className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg transition-colors"
                        >
                            <Download size={16} /> Tải file mẫu
                        </button>
                    </div>

                    {/* Upload Box */}
                    <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer relative group
                        ${file ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept=".xlsx, .xls, .csv"
                            className="hidden"
                        />

                        {file ? (
                            <div>
                                <FileSpreadsheet size={48} className="text-emerald-500 mx-auto mb-3" />
                                <p className="font-bold text-slate-700">{file.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                        ) : (
                            <div>
                                <Upload size={48} className="text-gray-300 group-hover:text-blue-400 mx-auto mb-3 transition-colors" />
                                <p className="font-bold text-slate-600">Click để tải file Excel (.xlsx)</p>
                                <p className="text-xs text-gray-400 mt-1">Hoặc kéo thả file vào đây</p>
                            </div>
                        )}
                    </div>

                    {/* Preview */}
                    {previewData.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Xem trước ({previewData.length} dòng)</p>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-gray-100 text-gray-600 font-bold border-b border-gray-200">
                                        <tr>
                                            {Object.keys(previewData[0]).slice(0, 5).map(key => (
                                                <th key={key} className="px-3 py-2 whitespace-nowrap">{key}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {previewData.slice(0, 3).map((row, idx) => (
                                            <tr key={idx}>
                                                {Object.values(row).slice(0, 5).map((val: any, i) => (
                                                    <td key={i} className="px-3 py-2 whitespace-nowrap text-gray-700">{val}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Status Message */}
                    {message && (
                        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                            {message.text}
                        </div>
                    )}
                </div>

                <div className="p-5 border-t border-gray-100 flex justify-end gap-2 bg-gray-50">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg">Đóng</button>
                    <button
                        onClick={handleImport}
                        disabled={!file || isLoading}
                        className={`px-6 py-2 text-sm font-bold text-white rounded-lg shadow-sm flex items-center gap-2 transition-all
                        ${!file || isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                    >
                        {isLoading ? <Loader size={16} className="animate-spin" /> : <Upload size={16} />}
                        {isLoading ? 'Đang xử lý...' : 'Tiến hành Import'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportModal;
