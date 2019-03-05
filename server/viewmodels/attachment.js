module.exports = class AttachmentViewModel {
  static createFromLocal (obj) {

  }

  static createFromJira (obj) {
    const result = new AttachmentViewModel()
    if (obj) {
      result.id = obj.id
      result.filename = obj.filename
      result.createdAt = obj.created
      result.mimeType = obj.mimeType
      result.contentUrl = obj.content
      result.thumbnailUrl = obj.thumbnail
    }
    return result
  }
}
