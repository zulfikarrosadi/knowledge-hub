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
import { CopyIcon, FileX, Loader2, SaveIcon } from 'lucide-react'
import { useFilesContext } from '~/lib/context/files-context'
import { useDebounce } from '~/hooks/use-debounce'

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

async function save(fileHandle: FileSystemFileHandle, content: string) {
	const file = await fileHandle.createWritable()
	await file.write(content)
	await file.close()
}

function LoadingOverlay() {
	return (
		<div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
			<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	);
}

function OpenFileScreen() {
	return (
		<div className='flex h-screen justify-center items-center flex-col gap-4'>
			<FileX size={48} className='text-muted-foreground' />
			<p className='text-muted-foreground'>Open or create new file</p>
		</div>
	)
}

function App({ params }: { params: Record<'*', string> }) {
	const ref = useRef<MDXEditorMethods>(null)
	const [initialMarkdown, setInitialMarkdown] = useState<string>('')
	const [isLoading, setIsLoading] = useState(false);
	const [isOpenFile, setIsOpenFile] = useState(false);
	const [currentFileHandle, setCurrentFileHandle] = useState<FileSystemFileHandle | null>(null)
	const filesContext = useFilesContext()
	const filePath = params['*'];
	const debounceUpdateContent = useDebounce(1000, save)

	// get content file effect
	useEffect(() => {
		let isActive = true;

		async function getFileContent(relativePath: string) {
			if (!relativePath) {
				setInitialMarkdown('');
				return;
			}

			setIsLoading(true);
			const currentFile = filesContext.files.find(
				(file) => file.relativePath === relativePath
			);

			if (!currentFile || currentFile.kind !== 'file') {
				if (isActive) {
					setInitialMarkdown(''); // Clear content if file not found or is a directory
					setIsLoading(false);
				}
				return;
			}
			setCurrentFileHandle(currentFile.handle)

			try {
				const fileHandle = await currentFile.handle.getFile();
				const content = await fileHandle.text();
				if (isActive) {
					setInitialMarkdown(content);
				}
			} catch (error) {
				console.error("Failed to read file content:", error);
				if (isActive) {
					setInitialMarkdown('## Error: Could not load file');
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
			if (ref.current.getMarkdown() !== initialMarkdown) {
				ref.current.setMarkdown(initialMarkdown);
			}
		}
	}, [initialMarkdown]);

	// toggle show editor 
	useEffect(() => {
		if (filePath) {
			setIsOpenFile(true)
		} else {
			setIsOpenFile(false)
		}
	}, [filePath])

	return (<>
		<div className='w-10/12 mx-auto'>
			{isLoading && <LoadingOverlay />}
			{!isOpenFile && <OpenFileScreen />}
			<MDXEditor
				ref={ref}
				contentEditableClassName='prose'
				markdown={initialMarkdown}
				className={!isOpenFile ? 'hidden' : undefined}
				onChange={(newContent) => {
					debounceUpdateContent(currentFileHandle, newContent)
				}}
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
