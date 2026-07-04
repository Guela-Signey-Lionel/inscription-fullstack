package com.pkfokam.inscription.shared.config;

import com.pkfokam.inscription.inscription.repository.InscriptionRepository;
import com.pkfokam.inscription.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.springframework.context.annotation.*;
import org.springframework.scheduling.quartz.QuartzJobBean;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Slf4j
@DisallowConcurrentExecution
class RelanceIncompletsJob extends QuartzJobBean {
    @Override
    protected void executeInternal(JobExecutionContext ctx) {
        log.info("[Quartz] Relance dossiers incomplets J+3");
    }
}

@Slf4j
@DisallowConcurrentExecution
class ExpirationDossiersJob extends QuartzJobBean {
    @Override
    protected void executeInternal(JobExecutionContext ctx) {
        log.info("[Quartz] Expiration dossiers EN_ATTENTE_COMPLEMENT dépassés");
    }
}

@Configuration
public class QuartzConfig {

    @Bean
    public JobDetail relanceJobDetail() {
        return JobBuilder.newJob(RelanceIncompletsJob.class)
            .withIdentity("relance-incomplets").storeDurably().build();
    }

    @Bean
    public Trigger relanceTrigger(JobDetail relanceJobDetail) {
        return TriggerBuilder.newTrigger()
            .forJob(relanceJobDetail).withIdentity("relance-trigger")
            .withSchedule(CronScheduleBuilder.cronSchedule("0 0 8 * * ?"))
            .build();
    }

    @Bean
    public JobDetail expirationJobDetail() {
        return JobBuilder.newJob(ExpirationDossiersJob.class)
            .withIdentity("expiration-dossiers").storeDurably().build();
    }

    @Bean
    public Trigger expirationTrigger(JobDetail expirationJobDetail) {
        return TriggerBuilder.newTrigger()
            .forJob(expirationJobDetail).withIdentity("expiration-trigger")
            .withSchedule(CronScheduleBuilder.cronSchedule("0 0 3 * * ?"))
            .build();
    }
}
