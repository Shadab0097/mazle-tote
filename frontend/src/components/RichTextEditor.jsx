import { useRef, useCallback } from 'react';
import {
    FiBold,
    FiItalic,
    FiUnderline,
    FiList,
} from 'react-icons/fi';

const ToolbarButton = ({ onClick, active, children, title }) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        className={`p-1.5 rounded-lg transition-all duration-150 cursor-pointer ${active
                ? 'bg-[#8ABEE8] text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-100 hover:text-[#2C2C2C]'
            }`}
    >
        {children}
    </button>
);

const RichTextEditor = ({ value, onChange, placeholder = 'Start typing...', rows = 6 }) => {
    const editorRef = useRef(null);

    const execCommand = useCallback((command, val = null) => {
        document.execCommand(command, false, val);
        // After executing a command, grab the updated HTML
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
        editorRef.current?.focus();
    }, [onChange]);

    const handleInput = useCallback(() => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    }, [onChange]);

    const handlePaste = useCallback((e) => {
        e.preventDefault();
        // Paste as plain text to avoid pasting styled content from other sources
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    }, []);

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#8ABEE8]/50 focus-within:border-[#8ABEE8] transition-all">
            {/* Toolbar */}
            <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border-b border-gray-200">
                <ToolbarButton onClick={() => execCommand('bold')} title="Bold">
                    <FiBold size={16} />
                </ToolbarButton>
                <ToolbarButton onClick={() => execCommand('italic')} title="Italic">
                    <FiItalic size={16} />
                </ToolbarButton>
                <ToolbarButton onClick={() => execCommand('underline')} title="Underline">
                    <FiUnderline size={16} />
                </ToolbarButton>

                <div className="w-px h-5 bg-gray-300 mx-1" />

                <ToolbarButton onClick={() => execCommand('formatBlock', 'h3')} title="Heading">
                    <span className="text-xs font-extrabold">H</span>
                </ToolbarButton>
                <ToolbarButton onClick={() => execCommand('formatBlock', 'h4')} title="Subheading">
                    <span className="text-[10px] font-extrabold">H2</span>
                </ToolbarButton>

                <div className="w-px h-5 bg-gray-300 mx-1" />

                <ToolbarButton onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
                    <FiList size={16} />
                </ToolbarButton>
                <ToolbarButton onClick={() => execCommand('insertOrderedList')} title="Numbered List">
                    <span className="text-xs font-extrabold">1.</span>
                </ToolbarButton>

                <div className="w-px h-5 bg-gray-300 mx-1" />

                <ToolbarButton onClick={() => execCommand('formatBlock', 'p')} title="Normal Text">
                    <span className="text-xs font-medium">¶</span>
                </ToolbarButton>
            </div>

            {/* Editable Area */}
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onPaste={handlePaste}
                dangerouslySetInnerHTML={{ __html: value || '' }}
                className="px-4 py-3 text-sm font-medium text-[#2C2C2C] outline-none overflow-y-auto
          [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400
          prose prose-sm max-w-none
          [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-[#2C2C2C] [&_h3]:mt-3 [&_h3]:mb-1
          [&_h4]:text-sm [&_h4]:font-bold [&_h4]:text-[#2C2C2C] [&_h4]:mt-2 [&_h4]:mb-1
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1
          [&_li]:my-0.5
          [&_b]:font-bold [&_strong]:font-bold
          [&_i]:italic [&_em]:italic
          [&_u]:underline"
                style={{ minHeight: `${rows * 1.5}em` }}
                data-placeholder={placeholder}
            />
        </div>
    );
};

export default RichTextEditor;
