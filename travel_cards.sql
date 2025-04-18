-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Apr 18, 2025 at 05:35 AM
-- Server version: 8.0.40
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `travelcard`
--

-- --------------------------------------------------------

--
-- Table structure for table `travel_cards`
--

CREATE TABLE `travel_cards` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `rating` decimal(2,1) NOT NULL,
  `date` date NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `category_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `travel_cards`
--

INSERT INTO `travel_cards` (`id`, `title`, `description`, `rating`, `date`, `image_url`, `category_id`, `user_id`) VALUES
(1, 'Osaka - Dotonbori', 'Visited Dotonbori in Osaka with my brother. Famous for neon lights and street food.', 5.0, '2023-07-18', '/uploads/osaka-dotonbori.jpg', 1, NULL),
(2, 'Tokyo - Tokyo Tower', 'Visited Tokyo Tower with my family. Known for its stunning views and iconic design.', 4.7, '2019-02-20', '/uploads/tokyo-tokyotower.jpg', 1, NULL),
(3, 'Seattle - Space Needle', 'Visited the Space Needle in Seattle. Offers panoramic views of the city and Mount Rainier.', 4.5, '2020-05-15', '/uploads/seattle-publicmarket.jpg', 1, NULL),
(77, 'hi', 'hi', 0.0, '2025-04-15', '/uploads/7b2f89496e3dfaf97c2dbb0aabb1f003', 1, NULL),
(84, 'ㅂㅂ', 'ㅂ', 0.0, '2025-04-15', '/uploads/e6c6cacb49603b06d634a5c92748ab4a', 1, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `travel_cards`
--
ALTER TABLE `travel_cards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `fk_user` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `travel_cards`
--
ALTER TABLE `travel_cards`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `travel_cards`
--
ALTER TABLE `travel_cards`
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `travel_cards_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
