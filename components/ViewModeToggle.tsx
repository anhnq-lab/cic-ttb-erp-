import React from 'react';

export type ViewMode = 'list' | 'kanban' | 'gantt';

interface ViewModeToggleProps {
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
}

/**
 * ViewModeToggle - Toggle buttons for switching between List/Kanban/Gantt views
 * Saves preference to localStorage
 */
export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ viewMode, onViewModeChange }) => {
    const modes: Array<{ value: ViewMode; label: string; icon: string }> = [
        { value: 'list', label: 'Danh sách', icon: '📋' },
        { value: 'kanban', label: 'Kanban', icon: '📊' },
        { value: 'gantt', label: 'Gantt', icon: '📅' }
    ];

    const handleClick = (mode: ViewMode) => {
        onViewModeChange(mode);
        // Save to localStorage
        localStorage.setItem('preferredViewMode', mode);
    };

    return (
        <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1 gap-1">
            {modes.map(mode => (
                <button
                    key={mode.value}
                    onClick={() => handleClick(mode.value)}
                    className={`
            px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
            ${viewMode === mode.value
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-gray-700 hover:bg-gray-100'
                        }
          `}
                >
                    <span className="mr-1">{mode.icon}</span>
                    {mode.label}
                </button>
            ))}
        </div>
    );
};

/**
 * Helper function to get saved view mode preference
 */
export const getSavedViewMode = (projectId?: string): ViewMode => {
    const saved = localStorage.getItem(
        projectId ? `viewMode_${projectId}` : 'preferredViewMode'
    );
    return (saved as ViewMode) || 'list';
};

/**
 * Helper function to save view mode preference
 */
export const saveViewMode = (mode: ViewMode, projectId?: string) => {
    localStorage.setItem(
        projectId ? `viewMode_${projectId}` : 'preferredViewMode',
        mode
    );
};
