CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `userType` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `doctors` (
  `drID` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `appdr_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`drID`),
  KEY `user_id` (`user_id`),
  KEY `idx_appdr_id` (`appdr_id`),
  CONSTRAINT `fk_user_id_doctors` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE `patients` (
  `patientID` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `selDrID` int(11) DEFAULT NULL,
  PRIMARY KEY (`patientID`),
  KEY `fk_selDrID` (`selDrID`),
  CONSTRAINT `fk_selDrID` FOREIGN KEY (`selDrID`) REFERENCES `doctors` (`drID`) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE `dr_schedule` (
  `appid` int(11) DEFAULT NULL,
  `doctorID` int(11) NOT NULL,
  `SlotDay` varchar(255) NOT NULL,
  `patientID` int(11) DEFAULT NULL,
  `SlotTime` time DEFAULT NULL,
  KEY `fk_doctor_schedule_user` (`doctorID`),
  KEY `fk_patientID` (`patientID`),
  KEY `fk_id_dr_schedule` (`appid`),
  CONSTRAINT `fk_doctor_schedule_user` FOREIGN KEY (`doctorID`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_id_dr_schedule` FOREIGN KEY (`appid`) REFERENCES `appointments` (`appid`),
  CONSTRAINT `fk_patientID` FOREIGN KEY (`patientID`) REFERENCES `patients` (`patientID`) ON DELETE SET NULL ON UPDATE CASCADE
);


CREATE TABLE `appointments` (
  `appid` int(11) NOT NULL AUTO_INCREMENT,
  `doctorID` int(11) NOT NULL,
  `SlotDay` varchar(255) NOT NULL,
  `SlotTime` time DEFAULT NULL,
  `patientID` int(11) DEFAULT NULL,
  PRIMARY KEY (`appid`)
)



