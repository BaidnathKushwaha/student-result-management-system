package com.resultmanagement.repository;

import com.resultmanagement.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // All notifications for a recipient, newest first
    List<Notification> findByRecipientUsernameOrderByTimestampDesc(String recipientUsername);

    // Unread only
    List<Notification> findByRecipientUsernameAndIsReadFalseOrderByTimestampDesc(String recipientUsername);

    // Unread count badge
    long countByRecipientUsernameAndIsReadFalse(String recipientUsername);

    // Mark all as read for a user in one query
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.recipientUsername = :username AND n.isRead = false")
    int markAllReadForUser(@Param("username") String username);
}