-- MySQL dump 10.13  Distrib 5.7.31, for Linux (x86_64)
--
-- Host: localhost    Database: hypati67_contadores
-- ------------------------------------------------------
-- Server version	5.7.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `hypati67_contadores`
--


--
-- Table structure for table `contadorD`
--

DROP TABLE IF EXISTS `contadorD`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contadorD` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(30) NOT NULL,
  `contador` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contadorD`
--

LOCK TABLES `contadorD` WRITE;
/*!40000 ALTER TABLE `contadorD` DISABLE KEYS */;
INSERT INTO `contadorD` (`id`, `nome`, `contador`) VALUES (1,'probabilidades',9765),(2,'poldefcla',43135),(3,'quadrilateros',12919),(4,'inversa',23952),(5,'angulos',28942),(6,'perimetros',9894),(7,'areas',1702),(8,'pitagoras',31351),(9,'lgeometricos',20842),(10,'potencias',24557),(11,'multdiv',57173),(12,'amarelo',2450),(13,'estatistica',5420),(14,'pontosretaseplanos',26492),(15,'direta',11421),(16,'arredondamentos',6674),(17,'razaoproporcao',3976),(18,'rq',1970),(19,'casosNotaveis',3132),(20,'fatorizacaoPolinomios',2501),(21,'rcubica',322);
/*!40000 ALTER TABLE `contadorD` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'hypati67_contadores'
--

--
-- Dumping routines for database 'hypati67_contadores'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-07-27 15:08:21
