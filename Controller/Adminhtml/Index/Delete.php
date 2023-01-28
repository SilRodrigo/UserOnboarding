<?php

/**
 * @author Rodrigo Silva
 * @copyright Copyright (c) 2022 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_Vitrine
 */

namespace Rsilva\UserOnboarding\Controller\Adminhtml\Index;

use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Backend\App\Action;
use Magento\Backend\App\Action\Context;
use Rsilva\UserOnboarding\Model\OnboardingFactory;

class Delete extends Action implements HttpPostActionInterface
{
    public const URL_PATH = '/index/delete';

    /**
     * Onboarding Factory
     *
     * @var OnboardingFactory
     */
    private $onboardingFactory;

    public function __construct(
        OnboardingFactory $onboardingFactory,
        Context $context
    ) {
        $this->onboardingFactory = $onboardingFactory;
        parent::__construct($context);
    }

    /**
     * @return \Magento\Backend\Model\View\Result\Redirect
     */
    public function execute()
    {
        $id = $this->getRequest()->getParam('entity_id');
        $resultRedirect = $this->resultRedirectFactory->create();
        try {
            $model = $this->onboardingFactory->create();
            $model->load($id);
            $model->delete();
            $this->messageManager->addSuccessMessage(__('You deleted the onboarding.'));
        } catch (\Exception $e) {
            $this->messageManager->addErrorMessage($e->getMessage());
            return $resultRedirect->setPath(
                Index::FRONTNAME . Edit::URL_PATH,
                ['attribute_id' => $this->getRequest()->getParam('attribute_id')]
            );
        }
        return $resultRedirect->setPath('*/*');
    }
}
