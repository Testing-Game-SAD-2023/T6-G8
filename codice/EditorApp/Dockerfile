# Usa un'immagine di base di Java versione 17
FROM openjdk:17

# Impostiamo la directory di lavoro
WORKDIR /app

# Copiamo il file JAR dell'applicazione nella directory di lavoro
COPY target/EditorApp-0.0.1-SNAPSHOT.jar app.jar

# Esponiamo la porta 8080
EXPOSE 8080

# Avviamo l'applicazione
CMD ["java", "-jar", "app.jar"]
