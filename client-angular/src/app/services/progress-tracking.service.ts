import { Injectable } from '@angular/core';

export interface ProgressMetrics {
  totalSections: number;
  completedSections: number;
  progressPercentage: number;
  sectionProgress: {
    basicInfo: number;
    whatWeNeed: number;
    dataFields: number;
    features: number;
    successCriteria: number;
    download: number;
  };
  estimatedTimeToComplete: string;
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ProgressTrackingService {
  
  calculateProgress(projectData: any): ProgressMetrics {
    const sectionProgress = {
      basicInfo: this.calculateBasicInfoProgress(projectData.project, projectData.stakeholders),
      whatWeNeed: this.calculateWhatWeNeedProgress(projectData.whatWeNeed),
      dataFields: this.calculateDataFieldsProgress(projectData.dataFields),
      features: this.calculateFeaturesProgress(projectData.features),
      successCriteria: this.calculateSuccessCriteriaProgress(projectData.successCriteria),
      download: this.calculateDownloadProgress(projectData)
    };

    const progressValues = Object.values(sectionProgress);
    const progressPercentage = Math.round(
      progressValues.reduce((sum, progress) => sum + progress, 0) / progressValues.length
    );

    const completedSections = progressValues.filter(progress => progress >= 80).length;
    const totalSections = progressValues.length;

    return {
      totalSections,
      completedSections,
      progressPercentage,
      sectionProgress,
      estimatedTimeToComplete: this.estimateTimeToComplete(progressPercentage),
      lastUpdated: new Date()
    };
  }

  private calculateBasicInfoProgress(project: any, stakeholders: any[] = []): number {
    let score = 0;
    const maxScore = 7;

    // Required fields
    if (project?.title?.trim()) score++;
    if (project?.author?.trim()) score++;
    if (project?.version?.trim()) score++;
    if (project?.description?.trim()) score++;
    if (project?.status) score++;
    if (project?.startDate) score++;
    
    // Stakeholders
    if (stakeholders.length > 0) {
      const validStakeholders = stakeholders.filter(s => 
        s.name?.trim() && s.role?.trim() && s.type
      );
      if (validStakeholders.length > 0) score++;
    }

    return Math.round((score / maxScore) * 100);
  }

  private calculateWhatWeNeedProgress(whatWeNeed: any): number {
    if (!whatWeNeed) return 0;

    let score = 0;
    const maxScore = 6;

    if (whatWeNeed.userExperienceGoals?.trim()) score++;
    if (whatWeNeed.scopeIncluded?.length > 0) score++;
    if (whatWeNeed.scopeExcluded?.length > 0) score++;
    if (whatWeNeed.keyAssumptions?.length > 0) score++;
    if (whatWeNeed.dependencies?.length > 0) score++;
    if (whatWeNeed.dataIntegrationNeeds?.trim()) score++;

    return Math.round((score / maxScore) * 100);
  }

  private calculateDataFieldsProgress(dataFields: any[] = []): number {
    if (dataFields.length === 0) return 0;

    const validFields = dataFields.filter(field => 
      field.fieldName?.trim() && 
      field.displayLabel?.trim() &&
      field.uiControl &&
      field.dataType
    );

    const progressScore = validFields.length / Math.max(dataFields.length, 1);
    return Math.round(progressScore * 100);
  }

  private calculateFeaturesProgress(features: any[] = []): number {
    if (features.length === 0) return 0;

    const validFeatures = features.filter(feature => 
      feature.title?.trim() && 
      feature.description?.trim() &&
      feature.importance &&
      feature.type
    );

    const detailedFeatures = validFeatures.filter(feature => 
      feature.details?.trim()
    );

    // Base score for having valid features
    const baseScore = (validFeatures.length / Math.max(features.length, 1)) * 60;
    // Bonus score for detailed features
    const bonusScore = (detailedFeatures.length / Math.max(features.length, 1)) * 40;

    return Math.round(baseScore + bonusScore);
  }

  private calculateSuccessCriteriaProgress(successCriteria: any): number {
    if (!successCriteria) return 0;

    let score = 0;
    const maxScore = 5;

    if (successCriteria.successMetrics?.length > 0) score++;
    if (successCriteria.userTestingPlan?.trim()) score++;
    if (successCriteria.dataQualityRules?.length > 0) score++;
    if (successCriteria.performanceRequirements?.length > 0) score++;
    if (successCriteria.securityRequirements?.length > 0) score++;

    return Math.round((score / maxScore) * 100);
  }

  private calculateDownloadProgress(projectData: any): number {
    // Download readiness based on overall completion
    const hasBasicInfo = projectData.project?.title && projectData.project?.author;
    const hasFeatures = projectData.features?.length > 0;
    const hasDataFields = projectData.dataFields?.length > 0;
    const hasSuccessCriteria = projectData.successCriteria?.successMetrics?.length > 0;

    let readinessScore = 0;
    if (hasBasicInfo) readinessScore += 25;
    if (hasFeatures) readinessScore += 25;
    if (hasDataFields) readinessScore += 25;
    if (hasSuccessCriteria) readinessScore += 25;

    return readinessScore;
  }

  private estimateTimeToComplete(progressPercentage: number): string {
    if (progressPercentage >= 90) return 'Almost done!';
    if (progressPercentage >= 70) return '1-2 hours';
    if (progressPercentage >= 50) return '2-4 hours';
    if (progressPercentage >= 25) return '4-8 hours';
    return '8+ hours';
  }

  getProgressColor(percentage: number): string {
    if (percentage >= 80) return '#10b981'; // Green
    if (percentage >= 60) return '#f59e0b'; // Yellow
    if (percentage >= 40) return '#f97316'; // Orange
    return '#ef4444'; // Red
  }

  getProgressStatus(percentage: number): string {
    if (percentage >= 90) return 'Almost Complete';
    if (percentage >= 70) return 'Good Progress';
    if (percentage >= 50) return 'Making Progress';
    if (percentage >= 25) return 'Getting Started';
    return 'Just Started';
  }

  getSectionCompletionIcon(percentage: number): string {
    if (percentage >= 90) return '✅';
    if (percentage >= 70) return '🔄';
    if (percentage >= 50) return '⚠️';
    return '❌';
  }
}
