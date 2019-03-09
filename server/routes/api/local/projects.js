const ProjectViewModel = require('../../../viewmodels/project')

module.exports = {
  get (req, res) {
    const id = req.params.projectId
    res.send(ProjectViewModel.createFromLocal())
  }
}
