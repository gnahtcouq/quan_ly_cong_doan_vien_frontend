import axios from 'axios'

export const uploadToCloudinary = async (
  file: File,
  department: string
): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET)
  formData.append('folder', department)

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_NAME
    }/image/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: false
    }
  )
  const url = res.data.secure_url
  return url
}

export const quillModules = {
  toolbar: [
    [{header: '1'}, {header: '2'}],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike'],
    [{list: 'ordered'}, {list: 'bullet'}, {list: 'check'}],
    [{indent: '-1'}, {indent: '+1'}],
    [{color: []}, {background: []}],
    ['link', 'image', 'video'],
    [{align: []}],
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
  'background',
  'align'
]
