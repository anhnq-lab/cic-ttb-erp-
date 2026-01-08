import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
    Box, Maximize2, Minimize2, RotateCw, ZoomIn, ZoomOut,
    Move, Download, Layers, Eye, EyeOff, ChevronRight,
    ChevronDown, Check, Loader, MousePointer, Home
} from 'lucide-react';
import type { Project } from '../types';

interface BIMModelViewerProps {
    project: Project;
}

interface ElementProperties {
    id: string;
    name: string;
    type: string;
    guid: string;
    geometryType: string;
    ifcElement: string;
    ifcElementType: string;
    ifcClass: string;
    material: string;
    height?: string;
    width?: string;
    length?: string;
}

interface ModelElement {
    id: string;
    name: string;
    type: string;
    children?: ModelElement[];
    visible: boolean;
}

const BIMModelViewer: React.FC<BIMModelViewerProps> = ({ project }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeTool, setActiveTool] = useState<'select' | 'rotate' | 'pan' | 'zoom'>('rotate');
    const [selectedElement, setSelectedElement] = useState<ElementProperties | null>(null);
    const [modelTree, setModelTree] = useState<ModelElement[]>([]);
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root', 'building']));

    // Sample element data for demo
    const sampleElements: ElementProperties[] = [
        { id: '1', name: 'Tường phía Bắc', type: 'IfcWall', guid: 'b4-e6bV3dOQC', geometryType: 'Parametric', ifcElement: 'IfcWall', ifcElementType: 'STANDARD', ifcClass: 'IfcWall', material: 'Gạch xây 200mm', height: '12m', width: '0.2m', length: '15m' },
        { id: '2', name: 'Sàn tầng 1', type: 'IfcSlab', guid: 'a3-f7cX2eNPC', geometryType: 'Parametric', ifcElement: 'IfcSlab', ifcElementType: 'FLOOR', ifcClass: 'IfcSlab', material: 'Bê tông cốt thép C30', height: '0.15m' },
        { id: '3', name: 'Cột C1', type: 'IfcColumn', guid: 'c5-d8bY1fMQB', geometryType: 'Parametric', ifcElement: 'IfcColumn', ifcElementType: 'STANDARD', ifcClass: 'IfcColumn', material: 'Bê tông cốt thép C40', height: '4m', width: '0.4m', length: '0.4m' },
        { id: '4', name: 'Cửa sổ W1', type: 'IfcWindow', guid: 'd6-e9cZ0gLRA', geometryType: 'Parametric', ifcElement: 'IfcWindow', ifcElementType: 'STANDARD', ifcClass: 'IfcWindow', material: 'Kính cường lực 12mm', height: '1.5m', width: '1.2m' },
    ];

    // Sample model tree
    useEffect(() => {
        setModelTree([
            {
                id: 'root',
                name: project.name || 'Mô hình BIM',
                type: 'Project',
                visible: true,
                children: [
                    {
                        id: 'building',
                        name: 'Tòa nhà chính',
                        type: 'Building',
                        visible: true,
                        children: [
                            { id: 'level1', name: 'Tầng 1', type: 'BuildingStorey', visible: true },
                            { id: 'level2', name: 'Tầng 2', type: 'BuildingStorey', visible: true },
                            { id: 'level3', name: 'Tầng 3', type: 'BuildingStorey', visible: true },
                            { id: 'roof', name: 'Mái', type: 'BuildingStorey', visible: true },
                        ]
                    }
                ]
            }
        ]);
    }, [project]);

    // Simulate model loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            setIsModelLoaded(true);
            // Select first element by default
            setSelectedElement(sampleElements[0]);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // Simple 3D rendering with Canvas 2D (demo visualization)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            const container = containerRef.current;
            if (container) {
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;
            }
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let rotation = 0;
        let animationId: number;

        const drawBuilding = () => {
            if (!ctx || !canvas) return;

            // Clear
            ctx.fillStyle = 'linear-gradient(180deg, #e0f2fe 0%, #7dd3fc 50%, #38bdf8 100%)';
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#0ea5e9');
            gradient.addColorStop(0.5, '#38bdf8');
            gradient.addColorStop(1, '#7dd3fc');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Ground plane
            ctx.fillStyle = '#22c55e';
            ctx.beginPath();
            const groundY = canvas.height * 0.75;
            ctx.ellipse(canvas.width / 2, groundY, canvas.width * 0.4, 80, 0, 0, Math.PI * 2);
            ctx.fill();

            // Center point
            const cx = canvas.width / 2;
            const cy = canvas.height * 0.45;
            const scale = Math.min(canvas.width, canvas.height) * 0.003;

            // Building base dimensions
            const buildingWidth = 100 * scale;
            const buildingDepth = 80 * scale;
            const floors = 3;
            const floorHeight = 35 * scale;

            // Rotation effect
            const rotAngle = rotation * 0.01;
            const cosR = Math.cos(rotAngle);
            const sinR = Math.sin(rotAngle);

            // Draw building floors
            for (let floor = 0; floor < floors; floor++) {
                const baseY = cy + (floors - floor - 1) * floorHeight;

                // Simple isometric projection
                const offsetX = floor * 2;

                // Floor slab
                ctx.fillStyle = floor === 0 ? '#94a3b8' : '#e2e8f0';
                ctx.strokeStyle = '#64748b';
                ctx.lineWidth = 2;

                // Draw floor as rectangle (simplified)
                ctx.beginPath();
                ctx.rect(cx - buildingWidth / 2 + offsetX, baseY - floorHeight, buildingWidth, floorHeight);
                ctx.fill();
                ctx.stroke();

                // Windows
                const windowCount = 4;
                const windowWidth = buildingWidth / (windowCount + 1) * 0.6;
                const windowHeight = floorHeight * 0.5;
                const windowY = baseY - floorHeight * 0.7;

                ctx.fillStyle = '#bfdbfe';
                ctx.strokeStyle = '#3b82f6';
                ctx.lineWidth = 1;

                for (let w = 0; w < windowCount; w++) {
                    const windowX = cx - buildingWidth / 2 + offsetX + (w + 0.7) * (buildingWidth / windowCount);
                    ctx.fillRect(windowX, windowY, windowWidth, windowHeight);
                    ctx.strokeRect(windowX, windowY, windowWidth, windowHeight);
                }
            }

            // Roof
            ctx.fillStyle = '#ef4444';
            ctx.strokeStyle = '#b91c1c';
            ctx.lineWidth = 3;

            const roofY = cy - floors * floorHeight + floorHeight;
            ctx.beginPath();
            ctx.moveTo(cx - buildingWidth / 2 - 10, roofY);
            ctx.lineTo(cx, roofY - 40 * scale);
            ctx.lineTo(cx + buildingWidth / 2 + 10, roofY);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Highlight selected element (demo)
            if (selectedElement) {
                ctx.strokeStyle = '#f97316';
                ctx.lineWidth = 4;
                ctx.setLineDash([8, 4]);

                if (selectedElement.type === 'IfcWall') {
                    ctx.strokeRect(cx - buildingWidth / 2, cy, buildingWidth, floorHeight);
                } else if (selectedElement.type === 'IfcSlab') {
                    ctx.strokeRect(cx - buildingWidth / 2, cy + floorHeight - 5, buildingWidth, 10);
                } else if (selectedElement.type === 'IfcColumn') {
                    ctx.strokeRect(cx - buildingWidth / 2, cy - floorHeight * 2, 15, floorHeight * 2);
                }
                ctx.setLineDash([]);
            }

            rotation += 0.5;
            animationId = requestAnimationFrame(drawBuilding);
        };

        if (!isLoading) {
            drawBuilding();
        }

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationId) cancelAnimationFrame(animationId);
        };
    }, [isLoading, selectedElement]);

    const handleElementClick = (element: ElementProperties) => {
        setSelectedElement(element);
    };

    const toggleNode = (nodeId: string) => {
        setExpandedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) {
                newSet.delete(nodeId);
            } else {
                newSet.add(nodeId);
            }
            return newSet;
        });
    };

    const toggleFullscreen = useCallback(() => {
        if (!containerRef.current) return;

        if (!isFullscreen) {
            containerRef.current.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
        setIsFullscreen(!isFullscreen);
    }, [isFullscreen]);

    const renderTreeNode = (node: ModelElement, depth: number = 0) => {
        const isExpanded = expandedNodes.has(node.id);
        const hasChildren = node.children && node.children.length > 0;

        return (
            <div key={node.id}>
                <div
                    className={`flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-slate-100 rounded transition-colors
            ${depth === 0 ? 'font-semibold text-slate-800' : 'text-slate-600'}`}
                    style={{ paddingLeft: depth * 16 + 8 }}
                    onClick={() => hasChildren && toggleNode(node.id)}
                >
                    {hasChildren ? (
                        isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    ) : (
                        <span className="w-3.5" />
                    )}
                    <Layers size={14} className="text-blue-500" />
                    <span className="truncate flex-1">{node.name}</span>
                    <button
                        onClick={(e) => { e.stopPropagation(); }}
                        className="p-0.5 hover:bg-slate-200 rounded"
                    >
                        {node.visible ? <Eye size={12} className="text-slate-400" /> : <EyeOff size={12} className="text-slate-300" />}
                    </button>
                </div>
                {hasChildren && isExpanded && (
                    <div>
                        {node.children!.map(child => renderTreeNode(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden animate-fade-in">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-2">
                    {/* Tool buttons */}
                    {[
                        { id: 'select', icon: MousePointer, label: 'Chọn' },
                        { id: 'rotate', icon: RotateCw, label: 'Xoay' },
                        { id: 'pan', icon: Move, label: 'Di chuyển' },
                        { id: 'zoom-in', icon: ZoomIn, label: 'Phóng to' },
                        { id: 'zoom-out', icon: ZoomOut, label: 'Thu nhỏ' },
                        { id: 'home', icon: Home, label: 'Về gốc' },
                    ].map((tool) => (
                        <button
                            key={tool.id}
                            onClick={() => tool.id !== 'home' && setActiveTool(tool.id as any)}
                            className={`p-2 rounded-lg transition-all ${activeTool === tool.id
                                    ? 'bg-indigo-100 text-indigo-600'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                                }`}
                            title={tool.label}
                        >
                            <tool.icon size={18} />
                        </button>
                    ))}

                    <div className="w-px h-6 bg-slate-300 mx-2" />

                    <button
                        onClick={toggleFullscreen}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
                        title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
                    >
                        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    {isModelLoaded && (
                        <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                            <Check size={14} /> MODEL LOADED
                        </span>
                    )}

                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                        <Download size={16} /> Tải file IFC
                    </button>
                </div>
            </div>

            <div className="flex" style={{ height: '600px' }}>
                {/* Model Tree Panel */}
                <div className="w-64 border-r border-slate-200 bg-slate-50 overflow-y-auto">
                    <div className="p-3 border-b border-slate-200 bg-white sticky top-0">
                        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Layers size={16} className="text-indigo-500" /> Cây Mô hình
                        </h3>
                    </div>
                    <div className="p-2">
                        {modelTree.map(node => renderTreeNode(node))}
                    </div>
                </div>

                {/* 3D Viewer Canvas */}
                <div ref={containerRef} className="flex-1 relative bg-gradient-to-b from-sky-400 to-sky-200">
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                            <div className="flex flex-col items-center gap-3">
                                <Loader className="animate-spin text-indigo-600" size={48} />
                                <span className="text-slate-600 font-medium">Đang tải mô hình 3D...</span>
                            </div>
                        </div>
                    ) : (
                        <canvas ref={canvasRef} className="w-full h-full" />
                    )}

                    {/* Element Quick Actions */}
                    {selectedElement && !isLoading && (
                        <div className="absolute bottom-4 left-4 flex gap-2">
                            {sampleElements.map((el) => (
                                <button
                                    key={el.id}
                                    onClick={() => handleElementClick(el)}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${selectedElement.id === el.id
                                            ? 'bg-orange-500 text-white shadow-lg'
                                            : 'bg-white/90 text-slate-700 hover:bg-white shadow'
                                        }`}
                                >
                                    {el.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Properties Panel */}
                <div className="w-72 border-l border-slate-200 bg-white overflow-y-auto">
                    <div className="p-4 border-b border-slate-200 sticky top-0 bg-white">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">PROPERTIES</h3>
                    </div>

                    {selectedElement ? (
                        <div className="p-4 space-y-4">
                            {/* Summary Section */}
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">SUMMARY</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500">Description</span>
                                        <span className="text-sm text-slate-400">-</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500">Element Type</span>
                                        <span className="text-sm text-indigo-600 font-medium">{selectedElement.name}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Identity Section */}
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">IDENTITY</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500">GUID</span>
                                        <span className="text-sm text-slate-700 font-mono">{selectedElement.guid}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500">Geometry Type</span>
                                        <span className="text-sm text-emerald-600 font-medium">{selectedElement.geometryType}</span>
                                    </div>
                                </div>
                            </div>

                            {/* IFC Properties Section */}
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">IFC PROPERTIES</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500">IFC Element</span>
                                        <span className="text-sm text-blue-600 font-medium">{selectedElement.ifcElement}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500">IFC Element Type</span>
                                        <span className="text-sm text-slate-700">{selectedElement.ifcElementType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500">IfcClass</span>
                                        <span className="text-sm text-purple-600 font-medium">{selectedElement.ifcClass}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Materials & Quantities Section */}
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">MATERIALS & QUANTITIES</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500">Material</span>
                                        <span className="text-sm text-orange-600 font-medium">{selectedElement.material}</span>
                                    </div>
                                    {selectedElement.height && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-slate-500">Height</span>
                                            <span className="text-sm text-slate-700">{selectedElement.height}</span>
                                        </div>
                                    )}
                                    {selectedElement.width && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-slate-500">Width</span>
                                            <span className="text-sm text-slate-700">{selectedElement.width}</span>
                                        </div>
                                    )}
                                    {selectedElement.length && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-slate-500">Length</span>
                                            <span className="text-sm text-slate-700">{selectedElement.length}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 text-center text-slate-400 text-sm">
                            Chọn một cấu kiện để xem chi tiết
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BIMModelViewer;
