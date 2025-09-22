import '@mdxeditor/editor/style.css'
import {
	MDXEditor,
	UndoRedo,
	BoldItalicUnderlineToggles,
	BlockTypeSelect,
	InsertCodeBlock,
	InsertTable,
	ListsToggle,
	Separator,
	toolbarPlugin,
	headingsPlugin,
	tablePlugin,
	listsPlugin,
	quotePlugin,
	codeBlockPlugin,
	thematicBreakPlugin,
	sandpackPlugin,
	codeMirrorPlugin,
	ConditionalContents,
	InsertSandpack,
	ChangeCodeMirrorLanguage,
	ShowSandpackInfo,
	markdownShortcutPlugin,
	linkPlugin,
	InsertImage,
	linkDialogPlugin,
	CreateLink,
	InsertThematicBreak,
	DiffSourceToggleWrapper,
	diffSourcePlugin,
	ButtonWithTooltip,
} from '@mdxeditor/editor'
import type { MDXEditorMethods, SandpackConfig } from '@mdxeditor/editor'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { CopyIcon, Loader2 } from 'lucide-react'
import { useFilesContext } from '~/lib/context/files-context'

const simpleSandpackConfig: SandpackConfig = {
	defaultPreset: 'react',
	presets: [
		{
			label: 'React',
			name: 'react',
			meta: 'live react',
			sandpackTemplate: 'react',
			sandpackTheme: 'light',
			snippetFileName: '/App.js',
			snippetLanguage: 'jsx',
		}
	]
}

function CopyMarkddown() {
	function handleOnClick(e: MouseEvent) {
		console.log('copy button clicked', e)
	}
	return (
		<ButtonWithTooltip onClick={(e) => handleOnClick(e)} className='hover:pointer' title='Copy makrdown'><CopyIcon size={24} /></ButtonWithTooltip>
	)
}

function LoadingOverlay() {
	return (
		<div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
			<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	);
}

function App({ params }: { params: Record<'*', string> }) {
	const ref = useRef<MDXEditorMethods>(null)
	const [markdown, setMarkdown] = useState<string>('')
	const [isLoading, setIsLoading] = useState(false);
	const filesContext = useFilesContext()
	const filePath = params['*'];

	useEffect(() => {
		let isActive = true;

		async function getFileContent(relativePath: string) {
			if (!relativePath) {
				setMarkdown('');
				return;
			}

			setIsLoading(true);
			const currentFile = filesContext.files.find(
				(file) => file.relativePath === relativePath
			);

			if (!currentFile || currentFile.kind !== 'file') {
				if (isActive) {
					setMarkdown(''); // Clear content if file not found or is a directory
					setIsLoading(false);
				}
				return;
			}

			try {
				const fileHandle = await currentFile.handle.getFile();
				const content = await fileHandle.text();
				if (isActive) {
					setMarkdown(content);
				}
			} catch (error) {
				console.error("Failed to read file content:", error);
				if (isActive) {
					setMarkdown('## Error: Could not load file');
				}
			} finally {
				if (isActive) {
					setIsLoading(false);
				}
			}
		}

		getFileContent(filePath);

		return () => {
			isActive = false;
		};
	}, [filePath, filesContext.files]);

	useEffect(() => {
		if (ref.current) {
			if (ref.current.getMarkdown() !== markdown) {
				ref.current.setMarkdown(markdown);
			}
		}
	}, [markdown]);

	return (<>
		<div className='w-10/12 mx-auto'>
			{isLoading && <LoadingOverlay />}
			<MDXEditor
				ref={ref}
				contentEditableClassName='prose'
				markdown={markdown}
				plugins={[
					headingsPlugin(),
					listsPlugin(),
					markdownShortcutPlugin(),
					linkPlugin(),
					linkDialogPlugin(),
					quotePlugin(),
					thematicBreakPlugin(),
					tablePlugin(),
					diffSourcePlugin(),
					codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
					sandpackPlugin({ sandpackConfig: simpleSandpackConfig }),
					codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', html: 'HTML', go: 'golang', css: 'CSS' } }),
					toolbarPlugin({
						toolbarContents: () => (
							<>
								<BoldItalicUnderlineToggles />
								<Separator />
								<ListsToggle />
								<Separator />
								<BlockTypeSelect />
								<Separator />
								<InsertTable />
								<InsertImage />
								<CreateLink />
								<InsertThematicBreak />
								<Separator />
								<ConditionalContents
									options={[
										{ when: (editor) => editor?.editorType === 'codeblock', contents: () => <ChangeCodeMirrorLanguage /> },
										{ when: (editor) => editor?.editorType === 'sandpack', contents: () => <ShowSandpackInfo /> },
										{
											fallback: () => (
												<>
													<InsertCodeBlock />
													<InsertSandpack />
												</>
											)
										}
									]}
								/>
								<Separator />
								<CopyMarkddown />
								<Separator />
								<DiffSourceToggleWrapper>
									<UndoRedo />
								</DiffSourceToggleWrapper>
							</>

						)
					}),
				]} />
		</div>
	</>)
}

export default App
