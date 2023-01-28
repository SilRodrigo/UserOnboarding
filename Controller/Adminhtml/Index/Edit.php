<?php

/**
 * @author Rodrigo Silva
 * @copyright Copyright (c) 2022 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_Vitrine
 */

namespace Rsilva\UserOnboarding\Controller\Adminhtml\Index;

use Rsilva\UserOnboarding\Model\OnboardingFactory;
use Rsilva\UserOnboarding\Model\Onboarding;
use Magento\Backend\App\Action\Context;
use Magento\Backend\Model\Session;
use Magento\Backend\Model\View\Result\RedirectFactory;
use Magento\Framework\View\Result\PageFactory;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\Registry;

class Edit extends \Magento\Backend\App\Action
{
    public const URL_PATH = '/index/edit';

    /**
     * Core registry
     *
     * @var Registry
     */
    protected $coreRegistry;

    /**
     * Onboarding Factory
     *
     * @var OnboardingFactory
     */
    private $onboardingFactory;

    /**
     * Page Factory
     *
     * @var PageFactory
     */
    private $resultPageFactory;

    /**
     * Result JSON factory
     *
     * @var JsonFactory
     */
    protected $resultJsonFactory;

    /**
     * Result redirect factory
     *
     * @var RedirectFactory
     */
    protected $resultRedirectFactory;

    /**
     * constructor
     *
     * @param Registry $coreRegistry
     * @param Session $backendSession
     * @param OnboardingFactory $onboardingFactory
     * @param PageFactory $resultPageFactory
     * @param JsonFactory $resultJsonFactory
     * @param RedirectFactory $resultRedirectFactory
     * @param Context $context
     */
    public function __construct(
        Registry $coreRegistry,
        OnboardingFactory $onboardingFactory,
        PageFactory $resultPageFactory,
        JsonFactory $resultJsonFactory,
        RedirectFactory $resultRedirectFactory,
        Context $context
    ) {
        $this->coreRegistry          = $coreRegistry;
        $this->onboardingFactory     = $onboardingFactory;
        $this->resultPageFactory     = $resultPageFactory;
        $this->resultJsonFactory     = $resultJsonFactory;
        $this->resultRedirectFactory = $resultRedirectFactory;
        parent::__construct($context);
    }

    /**
     * Init ProductsDisplay
     *
     * @return Onboarding
     */
    protected function _initPost()
    {
        $id = (int) $this->getRequest()->getParam(Onboarding::ID);
        /** @var Onboarding $onboardingEntity */
        $onboardingEntity = $this->onboardingFactory->create();
        if ($id) $onboardingEntity->load($id);
        $this->coreRegistry->register(Onboarding::MODULE, $onboardingEntity);
        return $onboardingEntity;
    }

    /**
     * @return \Magento\Backend\Model\View\Result\Page|\Magento\Backend\Model\View\Result\Redirect
     */
    public function execute()
    {
        /** @var Onboarding $onboardingEntity */
        $onboardingEntity = $this->_initPost();
        /** @var \Magento\Backend\Model\View\Result\Page $resultPage */
        $resultPage = $this->resultPageFactory->create();
        $resultPage->setActiveMenu(Index::MENU);
        $title = $onboardingEntity->getId() ? $onboardingEntity->getName() : __('New Onboarding');
        $resultPage->getConfig()->getTitle()->prepend($title);
        return $resultPage;
    }
}
