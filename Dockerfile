FROM openjdk:17-jdk-alpine

WORKDIR /app

# Corrigé : nom avec majuscule
COPY target/Packify-*.jar app.jar
COPY .env .env

EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=production

ENTRYPOINT ["java", "-jar", "app.jar"]