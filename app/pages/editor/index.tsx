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
import { useRef, type MouseEvent } from 'react'
import { CopyIcon } from 'lucide-react'

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

function App() {
	const ref = useRef<MDXEditorMethods>(null)
	return (<>
		<div className='w-10/12 mx-auto'>
			<MDXEditor
				ref={ref}
				contentEditableClassName='prose'
				markdown='# Hello World'
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
