import Sequelize, { Model } from 'sequelize'

class Publication extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        date_publication: Sequelize.DATE,
        subject: Sequelize.STRING,
        language: Sequelize.STRING,
        license: Sequelize.STRING,
        url_image: Sequelize.STRING,
        url_file: Sequelize.STRING,
        url_img: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3001/publication-img/${this.url_image}`
          },
        },
        url_downfile: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3001/publication-file/${this.url_file}`
          },
        },
      },
      { sequelize },
    )

    return this
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'usuario',
    })
  }
}
export default Publication
