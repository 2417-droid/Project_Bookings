# Build Stage
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copy Maven wrapper files and pom.xml to cache dependencies
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw

# Download dependencies (offline)
RUN ./mvnw dependency:go-offline -B

# Copy source code and build final jar
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root system user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy compiled jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Configuration for Render Free Tier (512MB RAM constraint)
ENV PORT=8080
ENV JAVA_OPTS="-Xmx384m -Xms256m -XX:+UseG1GC"

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT} -jar app.jar"]
