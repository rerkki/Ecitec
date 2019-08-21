

library(mongolite) 
con<- mongo(collection = "DHT_data", 
              db = "DHT_data", 
              url = "mongodb+srv://<user>:<password>@cluster0xxxxxxxxxx.mongodb.net/27017", 
              verbose = TRUE)

dat <- con$find()

plot(dat$T, type="l", col="red", ylim=c(0,100))
lines(dat$H, type="l", col="blue")
