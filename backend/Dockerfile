FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY . .
# Fix Windows CRLF line endings and grant execute permissions
RUN sed -i 's/\r$//' ./mvnw && chmod +x ./mvnw && ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENV PORT=8080
EXPOSE 8080
CMD ["java", "-Xmx384m", "-jar", "app.jar"]
