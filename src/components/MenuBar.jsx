import { useState, useRef, useCallback } from "react";
import { useEditorState } from "@tiptap/react";

/* ── Reusable primitives ── */
const Divider = () => <span className="toolbar-divider" aria-hidden="true" />;

const ToolbarButton = ({ onClick, isActive, title, disabled, children }) => (
    <button
        onClick={onClick}
        className={`toolbar-btn${isActive ? " is-active" : ""}${disabled ? " disabled" : ""}`}
        title={title}
        aria-label={title}
        aria-pressed={isActive ?? undefined}
        disabled={disabled}
        type="button"
    >
        {children}
    </button>
);

/* ── SVG icons (18×18) ── */
const Icons = {
    Undo: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
        </svg>
    ),
    Redo: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/>
        </svg>
    ),
    H1: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="m17 12 3-2v8"/>
        </svg>
    ),
    H2: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"/>
        </svg>
    ),
    H3: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2"/><path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"/>
        </svg>
    ),
    H4: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 10v4h4"/><path d="M21 10v8"/>
        </svg>
    ),
    H5: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 10h4"/><path d="M17 14h2a2 2 0 0 1 0 4h-2v-4z"/>
        </svg>
    ),
    H6: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><circle cx="19" cy="16" r="2"/><path d="M20 10c-2 2-3 3.5-3 6"/>
        </svg>
    ),
    Bold: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/>
        </svg>
    ),
    Italic: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/>
        </svg>
    ),
    Underline: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/>
        </svg>
    ),
    Strike: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" x2="20" y1="12" y2="12"/>
        </svg>
    ),
    Highlight: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>
        </svg>
    ),
    Subscript: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m4 5 8 8"/><path d="m12 5-8 8"/><path d="M20 19h-4c0-1.5.44-2 1.5-2.5S20 15.33 20 14c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07"/>
        </svg>
    ),
    Superscript: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m4 19 8-8"/><path d="m12 19-8-8"/><path d="M20 12h-4c0-1.5.442-2 1.5-2.5S20 8.334 20 7.002c0-.472-.17-.93-.484-1.29a2.105 2.105 0 0 0-2.617-.436c-.42.239-.738.614-.899 1.06"/>
        </svg>
    ),
    Code: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
        </svg>
    ),
    CodeBlock: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="18" height="18" x="3" y="3" rx="2"/><path d="m10 10-2 2 2 2"/><path d="m14 14 2-2-2-2"/>
        </svg>
    ),
    Blockquote: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
        </svg>
    ),
    BulletList: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/>
            <line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>
        </svg>
    ),
    OrderedList: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/>
            <path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
        </svg>
    ),
    AlignLeft: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 5H3"/><path d="M15 12H3"/><path d="M17 19H3"/>
        </svg>
    ),
    AlignCenter: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 5H3"/><path d="M17 12H7"/><path d="M19 19H5"/>
        </svg>
    ),
    AlignRight: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 5H3"/><path d="M21 12H9"/><path d="M21 19H7"/>
        </svg>
    ),
    AlignJustify: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 5H3"/><path d="M21 12H3"/><path d="M21 19H3"/>
        </svg>
    ),
    Link: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
    ),
    Unlink: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"/>
            <path d="m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"/>
            <line x1="8" x2="8" y1="2" y2="5"/><line x1="2" x2="5" y1="8" y2="8"/>
            <line x1="16" x2="16" y1="19" y2="22"/><line x1="19" x2="22" y1="16" y2="16"/>
        </svg>
    ),
    Image: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16 5h6"/><path d="M19 2v6"/>
            <path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5"/>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            <circle cx="9" cy="9" r="2"/>
        </svg>
    ),
    HorizontalRule: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="3" x2="21" y1="12" y2="12"/>
        </svg>
    ),
    HardBreak: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/>
        </svg>
    ),
    ClearFormat: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 7V4h16v3"/><path d="M5 20h6"/><path d="M13 4 8 20"/>
            <line x1="15" x2="21" y1="15" y2="21"/><line x1="21" x2="15" y1="15" y2="21"/>
        </svg>
    ),
};

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════ */
const MenuBar = ({ editor, setTipTapImage }) => {
    const imageInput = useRef();
    const [linkUrl, setLinkUrl] = useState("");
    const [showLinkModal, setShowLinkModal] = useState(false);

    const editorState = useEditorState({
        editor,
        selector: (ctx) => {
            if (!ctx.editor) return {};
            return {
                isBold:         ctx.editor.isActive("bold"),
                isItalic:       ctx.editor.isActive("italic"),
                isUnderline:    ctx.editor.isActive("underline"),
                isStrike:       ctx.editor.isActive("strike"),
                isSubscript:    ctx.editor.isActive("subscript"),
                isSuperscript:  ctx.editor.isActive("superscript"),
                isBlockQuote:   ctx.editor.isActive("blockquote"),
                isCode:         ctx.editor.isActive("code"),
                isCodeBlock:    ctx.editor.isActive("codeBlock"),
                isAlignLeft:    ctx.editor.isActive({ textAlign: "left" }),
                isAlignCenter:  ctx.editor.isActive({ textAlign: "center" }),
                isAlignRight:   ctx.editor.isActive({ textAlign: "right" }),
                isAlignJustify: ctx.editor.isActive({ textAlign: "justify" }),
                isHeading1:     ctx.editor.isActive("heading", { level: 1 }),
                isHeading2:     ctx.editor.isActive("heading", { level: 2 }),
                isHeading3:     ctx.editor.isActive("heading", { level: 3 }),
                isHeading4:     ctx.editor.isActive("heading", { level: 4 }),
                isHeading5:     ctx.editor.isActive("heading", { level: 5 }),
                isHeading6:     ctx.editor.isActive("heading", { level: 6 }),
                isHighlight:    ctx.editor.isActive("highlight"),
                isBulletList:   ctx.editor.isActive("bulletList"),
                isOrderedList:  ctx.editor.isActive("orderedList"),
                isLink:         ctx.editor.isActive("link"),
                canUndo:        ctx.editor.can().undo(),
                canRedo:        ctx.editor.can().redo(),
            };
        },
    });

    const handleImagePreview = (e) => {
        const imgFile = e.target.files[0];
        if (!imgFile) return;
        const blob = URL.createObjectURL(imgFile);
        setTipTapImage((prev) => [...prev, { imgFile, src: blob }]);
        editor.chain().focus().setImage({ src: blob }).createParagraphNear().run();
        e.target.value = "";
    };

    const openLinkModal = useCallback(() => {
        setLinkUrl(editor.getAttributes("link").href || "");
        setShowLinkModal(true);
    }, [editor]);

    const applyLink = useCallback(() => {
        if (!linkUrl.trim()) {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
        } else {
            editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl, target: "_blank" }).run();
        }
        setShowLinkModal(false);
        setLinkUrl("");
    }, [editor, linkUrl]);

    const removeLink = useCallback(() => {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        setShowLinkModal(false);
    }, [editor]);

    if (!editor) return null;

    return (
        <>
            {/* ── Link Modal ── */}
            {showLinkModal && (
                <div className="link-modal-overlay" role="dialog" aria-modal="true" aria-label="Insert link" onClick={() => setShowLinkModal(false)}>
                    <div className="link-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="link-modal-title">Insert Link</h3>
                        <input
                            type="url"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="link-modal-input"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") applyLink();
                                if (e.key === "Escape") setShowLinkModal(false);
                            }}
                            autoFocus
                        />
                        <div className="link-modal-actions">
                            <button type="button" className="link-modal-btn apply" onClick={applyLink}>Apply</button>
                            {editorState.isLink && (
                                <button type="button" className="link-modal-btn remove" onClick={removeLink}>Remove</button>
                            )}
                            <button type="button" className="link-modal-btn cancel" onClick={() => setShowLinkModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Toolbar ── */}
            <div className="menuBarButton" role="toolbar" aria-label="Text formatting toolbar">

                {/* Group: History */}
                <div className="toolbar-group" data-group="history">
                    <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editorState.canUndo} title="Undo (Ctrl+Z)">
                        <Icons.Undo />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editorState.canRedo} title="Redo (Ctrl+Y)">
                        <Icons.Redo />
                    </ToolbarButton>
                </div>

                <Divider />

                {/* Group: Headings */}
                <div className="toolbar-group" data-group="headings">
                    <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editorState.isHeading1} title="Heading 1"><Icons.H1 /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editorState.isHeading2} title="Heading 2"><Icons.H2 /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editorState.isHeading3} title="Heading 3"><Icons.H3 /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} isActive={editorState.isHeading4} title="Heading 4"><Icons.H4 /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()} isActive={editorState.isHeading5} title="Heading 5"><Icons.H5 /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()} isActive={editorState.isHeading6} title="Heading 6"><Icons.H6 /></ToolbarButton>
                </div>

                <Divider />

                {/* Group: Text Formatting */}
                <div className="toolbar-group" data-group="formatting">
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()}        isActive={editorState.isBold}        title="Bold (Ctrl+B)">        <Icons.Bold /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()}      isActive={editorState.isItalic}      title="Italic (Ctrl+I)">      <Icons.Italic /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()}   isActive={editorState.isUnderline}   title="Underline (Ctrl+U)">   <Icons.Underline /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()}      isActive={editorState.isStrike}      title="Strikethrough">        <Icons.Strike /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()}   isActive={editorState.isHighlight}   title="Highlight">            <Icons.Highlight /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleSubscript().run()}   isActive={editorState.isSubscript}   title="Subscript">            <Icons.Subscript /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleSuperscript().run()} isActive={editorState.isSuperscript} title="Superscript">          <Icons.Superscript /></ToolbarButton>
                </div>

                <Divider />

                {/* Group: Code & Blocks */}
                <div className="toolbar-group" data-group="blocks">
                    <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()}       isActive={editorState.isCode}      title="Inline Code">   <Icons.Code /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()}  isActive={editorState.isCodeBlock} title="Code Block">    <Icons.CodeBlock /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editorState.isBlockQuote} title="Blockquote">   <Icons.Blockquote /></ToolbarButton>
                </div>

                <Divider />

                {/* Group: Lists */}
                <div className="toolbar-group" data-group="lists">
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()}  isActive={editorState.isBulletList}  title="Bullet List">   <Icons.BulletList /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editorState.isOrderedList} title="Ordered List">  <Icons.OrderedList /></ToolbarButton>
                </div>

                <Divider />

                {/* Group: Alignment */}
                <div className="toolbar-group" data-group="align">
                    <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()}    isActive={editorState.isAlignLeft}    title="Align Left">    <Icons.AlignLeft /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()}  isActive={editorState.isAlignCenter}  title="Align Center">  <Icons.AlignCenter /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()}   isActive={editorState.isAlignRight}   title="Align Right">   <Icons.AlignRight /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("justify").run()} isActive={editorState.isAlignJustify} title="Justify">       <Icons.AlignJustify /></ToolbarButton>
                </div>

                <Divider />

                {/* Group: Link & Image */}
                <div className="toolbar-group" data-group="media">
                    <ToolbarButton onClick={openLinkModal} isActive={editorState.isLink} title="Insert / Edit Link">
                        <Icons.Link />
                    </ToolbarButton>
                    {editorState.isLink && (
                        <ToolbarButton onClick={removeLink} title="Remove Link">
                            <Icons.Unlink />
                        </ToolbarButton>
                    )}
                    <input type="file" name="imagePreview" style={{ display: "none" }} accept="image/*" ref={imageInput} onChange={handleImagePreview} />
                    <ToolbarButton onClick={() => imageInput.current.click()} title="Insert Image">
                        <Icons.Image />
                    </ToolbarButton>
                </div>

                <Divider />

                {/* Group: Insert */}
                <div className="toolbar-group" data-group="insert">
                    <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule"> <Icons.HorizontalRule /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().setHardBreak().run()}      title="Line Break">      <Icons.HardBreak /></ToolbarButton>
                </div>

                <Divider />

                {/* Group: Clear */}
                <div className="toolbar-group" data-group="clear">
                    <ToolbarButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear All Formatting">
                        <Icons.ClearFormat />
                    </ToolbarButton>
                </div>
            </div>
        </>
    );
};

export default MenuBar;