package edu.unah.kolvix.services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class KolvixMail {
    private final JavaMailSender mailSender;

    public void sendEmail(String receiver, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(receiver);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            log.info("Correo enviado a: {}", receiver);
        } catch (Exception e) {
            log.error("Error al enviar correo a {}: {}", receiver, e.getMessage());
            throw new RuntimeException("Fallo al enviar el correo", e);
        }
    }
}
