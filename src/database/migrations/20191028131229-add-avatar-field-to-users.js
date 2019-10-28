

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER, // Ele vai ser INTEGER pq vamos referenciar somente o ID da imagem e não seu conteúdo.
      references: { model: 'files', key: 'id' },
      onUpdate: 'CASCADE', // Se o arquivo for só alterado, então altere na tabela de users tbm.
      onDelete: 'SET NULL', // Se o arquivo for deletado na tabela files, então vai setar o avatar_id como nulo.
      allowNull: true
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  }
};
