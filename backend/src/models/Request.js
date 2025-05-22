const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Software = require('./Software');

const Request = sequelize.define('Request', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    managerComment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    documents: {
        type: DataTypes.JSONB,
        defaultValue: {}
    }
}, {
    timestamps: true
});

// Define associations
Request.belongsTo(User, { as: 'user' });
Request.belongsTo(User, { as: 'manager' });
Request.belongsTo(Software, { as: 'software' });

User.hasMany(Request, { as: 'requests', foreignKey: 'userId' });
User.hasMany(Request, { as: 'managedRequests', foreignKey: 'managerId' });
Software.hasMany(Request, { as: 'requests', foreignKey: 'softwareId' });

module.exports = Request; 