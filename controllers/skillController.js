const Skill = require('../models/Skill');

exports.getPublicSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, name: 1 });
    const categories = [...new Set(skills.map((s) => s.category))];
    res.render('pages/skills', { title: 'Skills', skills, categories });
  } catch {
    res.render('pages/skills', { title: 'Skills', skills: [], categories: [] });
  }
};

exports.getAdminSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.render('admin/skills', { title: 'Manage Skills', skills, admin: req.admin });
  } catch {
    req.flash('error_msg', 'Failed to load skills');
    res.redirect('/admin/dashboard');
  }
};

exports.createSkill = async (req, res) => {
  try {
    const { name, category, icon } = req.body;
    if (!name?.trim() || !category?.trim() || !icon?.trim()) {
      req.flash('error_msg', 'All fields are required');
      return res.redirect('/admin/skills');
    }
    await Skill.create({
      name: name.trim(),
      category: category.trim(),
      icon: icon.trim(),
    });
    req.flash('success_msg', 'Skill added successfully');
  } catch {
    req.flash('error_msg', 'Failed to add skill');
  }
  res.redirect('/admin/skills');
};

exports.updateSkill = async (req, res) => {
  try {
    const { name, category, icon } = req.body;
    await Skill.findByIdAndUpdate(req.params.id, {
      name: name?.trim(),
      category: category?.trim(),
      icon: icon?.trim(),
    });
    req.flash('success_msg', 'Skill updated successfully');
  } catch {
    req.flash('error_msg', 'Failed to update skill');
  }
  res.redirect('/admin/skills');
};

exports.deleteSkill = async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Skill deleted successfully');
  } catch {
    req.flash('error_msg', 'Failed to delete skill');
  }
  res.redirect('/admin/skills');
};
