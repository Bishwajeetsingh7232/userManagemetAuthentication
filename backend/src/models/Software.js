const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Software = sequelize.define('Software', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
   
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    requiredDocuments: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    }
}, {
    timestamps: true
});

module.exports = Software; 