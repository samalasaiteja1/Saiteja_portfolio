const Project = require('../models/Project');
const { cloudinary } = require('../config/cloudinary');

const deleteCloudinaryImage = async (imageUrl) => {
  if (!imageUrl?.includes('cloudinary')) return;
  try {
    const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
    await cloudinary.uploader.destroy(`portfolio/projects/${publicId.split('/').pop()}`);
  } catch {
    /* ignore cleanup errors */
  }
};

exports.getPublicProjects = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search?.trim()) {
      query = {
        $or: [
          { title: { $regex: search.trim(), $options: 'i' } },
          { technologies: { $regex: search.trim(), $options: 'i' } },
        ],
      };
    }
    const projects = await Project.find(query).sort({ createdAt: -1 });
    res.render('pages/projects', { title: 'Projects', projects, search: search || '' });
  } catch {
    res.render('pages/projects', { title: 'Projects', projects: [], search: '' });
  }
};

exports.getAdminProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.render('admin/projects', { title: 'Manage Projects', projects, admin: req.admin });
  } catch {
    req.flash('error_msg', 'Failed to load projects');
    res.redirect('/admin/dashboard');
  }
};

exports.createProject = async (req, res) => {
  try {
    const { title, description, technologies, githubLink, liveLink } = req.body;
    if (!title?.trim() || !description?.trim() || !technologies?.trim()) {
      req.flash('error_msg', 'Title, description, and technologies are required');
      return res.redirect('/admin/projects');
    }
    await Project.create({
      title: title.trim(),
      description: description.trim(),
      technologies: technologies.trim(),
      githubLink: githubLink?.trim() || '',
      liveLink: liveLink?.trim() || '',
      image: req.file?.path || '',
    });
    req.flash('success_msg', 'Project added successfully');
  } catch {
    req.flash('error_msg', 'Failed to add project');
  }
  res.redirect('/admin/projects');
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      req.flash('error_msg', 'Project not found');
      return res.redirect('/admin/projects');
    }

    const { title, description, technologies, githubLink, liveLink } = req.body;
    const updateData = {
      title: title?.trim(),
      description: description?.trim(),
      technologies: technologies?.trim(),
      githubLink: githubLink?.trim() || '',
      liveLink: liveLink?.trim() || '',
    };

    if (req.file?.path) {
      await deleteCloudinaryImage(project.image);
      updateData.image = req.file.path;
    }

    await Project.findByIdAndUpdate(req.params.id, updateData);
    req.flash('success_msg', 'Project updated successfully');
  } catch {
    req.flash('error_msg', 'Failed to update project');
  }
  res.redirect('/admin/projects');
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project?.image) await deleteCloudinaryImage(project.image);
    await Project.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Project deleted successfully');
  } catch {
    req.flash('error_msg', 'Failed to delete project');
  }
  res.redirect('/admin/projects');
};
