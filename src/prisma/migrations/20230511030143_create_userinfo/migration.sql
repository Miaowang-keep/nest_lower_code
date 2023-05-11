-- CreateTable
CREATE TABLE "UserInfo" (
    "userid" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "realname" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "userState" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserInfo_pkey" PRIMARY KEY ("userid")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInfo_phone_key" ON "UserInfo"("phone");
