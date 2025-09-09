import { Injectable } from '@angular/core';

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: 'web' | 'mobile' | 'desktop' | 'api' | 'data' | 'other';
  icon: string;
  defaultData: {
    project: any;
    stakeholders: any[];
    whatWeNeed: any;
    dataFields: any[];
    features: any[];
    successCriteria: any;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProjectTemplatesService {
  private templates: ProjectTemplate[] = [
    {
      id: 'web-app',
      name: 'Web Application',
      description: 'Full-stack web application with user authentication and database',
      category: 'web',
      icon: '🌐',
      defaultData: {
        project: {
          title: 'New Web Application',
          version: '1.0.0',
          author: '',
          description: 'A modern web application built with responsive design and user-friendly interface',
          status: 'draft'
        },
        stakeholders: [
          { name: 'Product Manager', role: 'Product Owner', type: 'primary', email: '' },
          { name: 'Lead Developer', role: 'Technical Lead', type: 'primary', email: '' },
          { name: 'UX Designer', role: 'User Experience Designer', type: 'secondary', email: '' }
        ],
        whatWeNeed: {
          userExperienceGoals: 'Create an intuitive, responsive web application that provides seamless user experience across all devices',
          scopeIncluded: [
            'User registration and authentication',
            'Responsive web design',
            'Database integration',
            'API development',
            'Security implementation'
          ],
          scopeExcluded: [
            'Mobile app development',
            'Third-party integrations (Phase 2)',
            'Advanced analytics (Phase 2)'
          ],
          keyAssumptions: [
            'Users have modern web browsers',
            'Stable internet connection available',
            'Database hosting is available'
          ],
          dependencies: [
            'Web hosting service',
            'Database server',
            'SSL certificate'
          ],
          dataIntegrationNeeds: 'User data, application data, session management, and secure data storage',
          externalServices: ['Email service', 'Payment gateway', 'Cloud storage']
        },
        dataFields: [
          {
            fieldName: 'user_email',
            displayLabel: 'Email Address',
            uiControl: 'input',
            dataType: 'string',
            placeholder: 'Enter your email',
            required: true,
            validationRules: ['email', 'required'],
            specifications: 'Primary user identification field'
          },
          {
            fieldName: 'user_password',
            displayLabel: 'Password',
            uiControl: 'input',
            dataType: 'string',
            placeholder: 'Enter secure password',
            required: true,
            validationRules: ['min:8', 'complexity'],
            specifications: 'Secure password with encryption'
          }
        ],
        features: [
          {
            title: 'User Authentication System',
            description: 'Secure login and registration system',
            importance: 'high',
            type: 'functional',
            details: 'JWT-based authentication with password encryption and session management'
          },
          {
            title: 'Responsive Design',
            description: 'Mobile-first responsive design',
            importance: 'high',
            type: 'non-functional',
            details: 'Works seamlessly on desktop, tablet, and mobile devices'
          }
        ],
        successCriteria: {
          successMetrics: [
            'Page load time < 2 seconds',
            '99.9% uptime',
            'Cross-browser compatibility'
          ],
          userTestingPlan: 'Conduct usability testing with 10 users across different devices',
          dataQualityRules: ['Email validation', 'Data encryption', 'Backup procedures'],
          performanceRequirements: ['< 2s page load', '1000 concurrent users', 'Mobile optimization'],
          securityRequirements: ['HTTPS encryption', 'Input validation', 'SQL injection prevention']
        }
      }
    },
    {
      id: 'mobile-app',
      name: 'Mobile Application',
      description: 'Cross-platform mobile app with native functionality',
      category: 'mobile',
      icon: '📱',
      defaultData: {
        project: {
          title: 'New Mobile Application',
          version: '1.0.0',
          author: '',
          description: 'Cross-platform mobile application with native performance and modern UI',
          status: 'draft'
        },
        stakeholders: [
          { name: 'Mobile Product Manager', role: 'Product Owner', type: 'primary', email: '' },
          { name: 'Mobile Developer', role: 'Lead Developer', type: 'primary', email: '' },
          { name: 'UI/UX Designer', role: 'Mobile Designer', type: 'secondary', email: '' }
        ],
        whatWeNeed: {
          userExperienceGoals: 'Create a native-feeling mobile app with smooth animations and intuitive navigation',
          scopeIncluded: [
            'Cross-platform development (iOS/Android)',
            'Native device features integration',
            'Offline functionality',
            'Push notifications',
            'App store deployment'
          ],
          scopeExcluded: [
            'Web version',
            'Desktop application',
            'Advanced AR features'
          ],
          keyAssumptions: [
            'Target iOS 14+ and Android 8+',
            'Users have smartphones with internet',
            'App store approval process'
          ],
          dependencies: [
            'Apple Developer Account',
            'Google Play Console',
            'Push notification service'
          ],
          dataIntegrationNeeds: 'User profiles, app data synchronization, offline data caching',
          externalServices: ['Push notifications', 'Analytics', 'Crash reporting']
        },
        dataFields: [
          {
            fieldName: 'device_token',
            displayLabel: 'Device Token',
            uiControl: 'input',
            dataType: 'string',
            placeholder: 'Auto-generated',
            required: true,
            validationRules: ['required'],
            specifications: 'Unique device identifier for push notifications'
          }
        ],
        features: [
          {
            title: 'Push Notifications',
            description: 'Real-time push notification system',
            importance: 'high',
            type: 'functional',
            details: 'Send targeted notifications to users based on preferences and behavior'
          },
          {
            title: 'Offline Mode',
            description: 'App functionality without internet',
            importance: 'medium',
            type: 'functional',
            details: 'Core features work offline with data sync when connected'
          }
        ],
        successCriteria: {
          successMetrics: [
            'App startup time < 3 seconds',
            'Crash rate < 1%',
            '4.5+ star rating'
          ],
          userTestingPlan: 'Beta testing with 50 users on iOS and Android devices',
          dataQualityRules: ['Data encryption', 'Secure API calls', 'Local storage protection'],
          performanceRequirements: ['< 3s startup time', 'Smooth 60fps animations', 'Battery optimization'],
          securityRequirements: ['API encryption', 'Secure storage', 'Biometric authentication']
        }
      }
    },
    {
      id: 'api-service',
      name: 'API Service',
      description: 'RESTful API service with authentication and documentation',
      category: 'api',
      icon: '🔌',
      defaultData: {
        project: {
          title: 'New API Service',
          version: '1.0.0',
          author: '',
          description: 'Scalable RESTful API service with comprehensive documentation and security',
          status: 'draft'
        },
        stakeholders: [
          { name: 'API Product Manager', role: 'Product Owner', type: 'primary', email: '' },
          { name: 'Backend Developer', role: 'Lead Developer', type: 'primary', email: '' },
          { name: 'DevOps Engineer', role: 'Infrastructure', type: 'secondary', email: '' }
        ],
        whatWeNeed: {
          userExperienceGoals: 'Provide a reliable, well-documented API that developers can easily integrate',
          scopeIncluded: [
            'RESTful API endpoints',
            'Authentication system',
            'API documentation',
            'Rate limiting',
            'Error handling'
          ],
          scopeExcluded: [
            'Frontend application',
            'Real-time features (WebSockets)',
            'GraphQL implementation'
          ],
          keyAssumptions: [
            'Clients understand REST principles',
            'JSON is the preferred data format',
            'Standard HTTP status codes'
          ],
          dependencies: [
            'Database server',
            'Authentication service',
            'API documentation platform'
          ],
          dataIntegrationNeeds: 'User authentication, business data, audit logs, and API usage metrics',
          externalServices: ['Database', 'Authentication provider', 'Monitoring tools']
        },
        dataFields: [
          {
            fieldName: 'api_key',
            displayLabel: 'API Key',
            uiControl: 'input',
            dataType: 'string',
            placeholder: 'Auto-generated API key',
            required: true,
            validationRules: ['required', 'min:32'],
            specifications: 'Unique API key for client authentication'
          }
        ],
        features: [
          {
            title: 'API Authentication',
            description: 'Secure API key and OAuth authentication',
            importance: 'high',
            type: 'functional',
            details: 'Support for API keys and OAuth 2.0 authentication flows'
          },
          {
            title: 'Rate Limiting',
            description: 'API request rate limiting and throttling',
            importance: 'high',
            type: 'non-functional',
            details: 'Prevent API abuse with configurable rate limits per client'
          }
        ],
        successCriteria: {
          successMetrics: [
            'API response time < 200ms',
            '99.99% uptime',
            'Complete API documentation'
          ],
          userTestingPlan: 'Integration testing with partner developers and automated API tests',
          dataQualityRules: ['Input validation', 'Output sanitization', 'Audit logging'],
          performanceRequirements: ['< 200ms response time', '10,000 requests/minute', 'Auto-scaling'],
          securityRequirements: ['API key authentication', 'HTTPS only', 'Input validation']
        }
      }
    },
    {
      id: 'data-analytics',
      name: 'Data Analytics Platform',
      description: 'Business intelligence and data analytics dashboard',
      category: 'data',
      icon: '📊',
      defaultData: {
        project: {
          title: 'New Data Analytics Platform',
          version: '1.0.0',
          author: '',
          description: 'Comprehensive data analytics platform with real-time dashboards and reporting',
          status: 'draft'
        },
        stakeholders: [
          { name: 'Data Product Manager', role: 'Product Owner', type: 'primary', email: '' },
          { name: 'Data Engineer', role: 'Lead Developer', type: 'primary', email: '' },
          { name: 'Data Analyst', role: 'Business Analyst', type: 'secondary', email: '' }
        ],
        whatWeNeed: {
          userExperienceGoals: 'Provide intuitive data visualization and insights for business decision making',
          scopeIncluded: [
            'Interactive dashboards',
            'Real-time data processing',
            'Custom report generation',
            'Data export functionality',
            'User role management'
          ],
          scopeExcluded: [
            'Machine learning models',
            'Predictive analytics',
            'Data collection systems'
          ],
          keyAssumptions: [
            'Data sources are available via APIs',
            'Users understand basic analytics concepts',
            'Data quality is maintained upstream'
          ],
          dependencies: [
            'Data warehouse',
            'ETL processes',
            'Visualization libraries'
          ],
          dataIntegrationNeeds: 'Business metrics, user behavior data, performance indicators, and historical trends',
          externalServices: ['Data warehouse', 'ETL tools', 'Export services']
        },
        dataFields: [
          {
            fieldName: 'metric_value',
            displayLabel: 'Metric Value',
            uiControl: 'input',
            dataType: 'number',
            placeholder: 'Enter metric value',
            required: true,
            validationRules: ['required', 'number'],
            specifications: 'Numerical value for business metrics'
          }
        ],
        features: [
          {
            title: 'Interactive Dashboards',
            description: 'Customizable business intelligence dashboards',
            importance: 'high',
            type: 'functional',
            details: 'Drag-and-drop dashboard builder with real-time data updates'
          },
          {
            title: 'Report Scheduling',
            description: 'Automated report generation and distribution',
            importance: 'medium',
            type: 'functional',
            details: 'Schedule reports to be generated and emailed automatically'
          }
        ],
        successCriteria: {
          successMetrics: [
            'Dashboard load time < 5 seconds',
            'Data accuracy 99.9%',
            'User adoption rate > 80%'
          ],
          userTestingPlan: 'User acceptance testing with business stakeholders and data analysts',
          dataQualityRules: ['Data validation', 'Source verification', 'Anomaly detection'],
          performanceRequirements: ['< 5s dashboard load', 'Real-time data updates', 'Concurrent users support'],
          securityRequirements: ['Role-based access', 'Data encryption', 'Audit trails']
        }
      }
    }
  ];

  getTemplates(): ProjectTemplate[] {
    return this.templates;
  }

  getTemplatesByCategory(category: string): ProjectTemplate[] {
    return this.templates.filter(template => template.category === category);
  }

  getTemplate(id: string): ProjectTemplate | undefined {
    return this.templates.find(template => template.id === id);
  }

  getCategories(): string[] {
    return [...new Set(this.templates.map(template => template.category))];
  }
}
