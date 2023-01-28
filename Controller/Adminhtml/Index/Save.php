<?php

/**
 * @author Rodrigo Silva
 * @copyright Copyright (c) 2022 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_Vitrine
 */

namespace Rsilva\UserOnboarding\Controller\Adminhtml\Index;

use Rsilva\UserOnboarding\Model\OnboardingFactory;
use Rsilva\UserOnboarding\Model\Onboarding;
use Magento\Backend\App\Action;
use Magento\Backend\App\Action\Context;
use Magento\Framework\App\ObjectManager;

/**
 * Class Save for save checkout fields
 */
class Save extends Action
{
    public const SAVE_ERROR = "Error on saving entity";

    /**
     * @var OnboardingFactory
     */
    private $onboardingFactory;

    /**
     * @var Onboarding
     */
    private $model;

    public function __construct(
        Context $context,
        OnboardingFactory $onboardingFactory = null
    ) {
        $this->onboardingFactory = $onboardingFactory ?: ObjectManager::getInstance()->get(OnboardingFactory::class);
        parent::__construct($context);
    }

    public function execute()
    {
        $postData = $this->getRequest()->getPostValue();
        if ($postData) {
            try {
                $this->model = $this->onboardingFactory->create();
                $this->model->load($this->model->getEntityId());
                $this->model->setData($postData);
                $this->model->save();
                $this->messageManager->addSuccessMessage(__('Saved successfully'));
            } catch (\Exception $e) {
                $this->messageManager->addErrorMessage($e->getMessage());
            }
        }
        return $this->resultRedirectFactory->create()
            ->setPath('*/*', ['_current' => true]);
    }
}
