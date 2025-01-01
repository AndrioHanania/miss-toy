import { useState, useEffect } from 'react'
import { uploadService } from '../services/upload.service'

export function ImgUploader({ handleChange, imageUrl = null, id, className }) {
    
    const [imgData, setImgData] = useState({
        imageUrl,
        height: 500,
        width: 500,
    })

    const [isUploading, setIsUploading] = useState(false)

    useEffect(() => {
        setImgData(prevImgData => ({
            ...prevImgData,
            imageUrl,
        }))
    }, [imageUrl])
    
    async function uploadImg(ev) {
        setIsUploading(true)
        const { secure_url, height, width } = await uploadService.uploadImg(ev)
        setImgData({ imageUrl: secure_url, width, height })
        setIsUploading(false)
        handleChange({ target: { ...ev.target, value: secure_url } })
    }

    function getUploadLabel() {
        if (imgData.imageUrl) return 'Upload Another?'
        return isUploading ? 'Uploading....' : 'Upload Image'
    }

    return (
        <div className={className}>
            {imgData.imageUrl && <img src={imgData.imageUrl}/>}
            <label htmlFor={id}>{getUploadLabel()}</label>
            <input type="file" onChange={uploadImg} accept="img/*" id={id} name={id}/>
        </div>
    )
}