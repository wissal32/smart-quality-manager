import { Upload, X } from 'lucide-react'
import { useState } from 'react'

export default function AuditPhotoUploader({ label, value = [], onChange, disabled = false }) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
  }

  const handleChange = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
  }

  const handleFiles = (files) => {
    const newFiles = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
      file: file,
      preview: URL.createObjectURL(file),
    }))

    const currentValue = Array.isArray(value) ? value : []
    onChange([...currentValue, ...newFiles])
  }

  const removeFile = (index) => {
    const newValue = Array.isArray(value) ? value.filter((_, i) => i !== index) : []
    onChange(newValue)
  }

  const fileList = Array.isArray(value) ? value : []

  return (
    <div className="field">
      <label className="label">{label}</label>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: dragActive ? '2px solid var(--primary)' : '1px dashed var(--panel-border)',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          background: dragActive ? 'rgba(56, 189, 248, 0.05)' : 'rgba(15, 23, 42, 0.3)',
          transition: 'all 0.2s ease',
        }}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          disabled={disabled}
          style={{ display: 'none' }}
          id={`photo-upload-${label}`}
        />
        <label htmlFor={`photo-upload-${label}`} style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
          <Upload size={32} style={{ margin: '0 auto 12px', color: 'var(--primary)' }} />
          <p style={{ fontWeight: 700, color: 'var(--text-strong)', marginBottom: '4px' }}>
            Drop photos here or click to select
          </p>
          <p className="muted" style={{ fontSize: '0.85rem' }}>
            Supported: JPG, PNG, WebP (max 10MB each)
          </p>
        </label>
      </div>

      {fileList.length > 0 && (
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
          {fileList.map((fileItem, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                background: 'rgba(15, 23, 42, 0.5)',
              }}
            >
              {fileItem.preview ? (
                <img
                  src={fileItem.preview}
                  alt="preview"
                  style={{
                    width: '100%',
                    height: '100px',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100px',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'var(--muted)',
                    fontSize: '0.8rem',
                  }}
                >
                  {fileItem.substring ? fileItem.substring(0, 20) : 'Photo'}
                </div>
              )}
              <button
                type="button"
                onClick={() => removeFile(index)}
                disabled={disabled}
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.9)',
                  border: 'none',
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  padding: 0,
                }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
