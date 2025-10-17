-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "postCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "numberOfDirectors" INTEGER,
    "numberOfShareholders" INTEGER,
    "activities" TEXT,
    "secCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Incorporation Requested',
    "dateOfIncorporation" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
