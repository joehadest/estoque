CREATE DATABASE IF NOT EXISTS `estoque`;
USE `estoque`;

CREATE TABLE IF NOT EXISTS `itens_do_estoque` (
  `codigo` varchar(50) NOT NULL PRIMARY KEY,
  `nome` varchar(100) NOT NULL,
  `quantidade` int NOT NULL DEFAULT 0,
  `localizacao` varchar(100),
  `data_atualizacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
