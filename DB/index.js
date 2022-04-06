const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('ligmo', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql',
})

// 测试数据连接是否成功
async function verifyDB() {
    try {
        await sequelize.authenticate();
        console.log('DB Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

verifyDB()

// 定义数据模型
const User = sequelize.define('User', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING
    }
})


// 同步数据库
async function syncDB() {

    await sequelize.sync().then(
        console.log('模型同步成功')
    )
}

syncDB()



module.exports = sequelize
