// quillSetup.ts

import Quill from 'quill'
import ImageResize from 'quill-image-resize-module-react'

Quill.register('modules/imageResize', ImageResize)

export const quillModules = {
  toolbar: [
    [{header: '1'}, {header: '2'}],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike'],
    [{list: 'ordered'}, {indent: '-1'}, {indent: '+1'}],
    [{color: []}, {background: []}],
    ['link', 'image', 'video'],
    ['clean']
  ],
  imageResize: {
    modules: ['Resize', 'Toolbar']
  }
}

export const quillFormats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'indent',
  'link',
  'image',
  'video',
  'color',
  'background'
]
