<script setup lang="ts"></script>

<template>
  <UPageCard v-for="category in categories" variant="soft" :key="category.id" class="col-span-1">
    <template #default>
      <UContainer class="grid grid-cols-4 w-full justify-between items-center !p-0 !m-0">
        <div class="col-span-2">
          <h5 class="font-semibold truncate w-full">{{ category.name }}</h5>
        </div>
        <div></div>
        <UContainer class="flex flex-row col-span-1 gap-3 !p-0 !m-0 justify-end">
          <UModal title="Edit Category">
            <UButton icon="i-fa-edit" color="primary" class="flex-shrink-0" />
            <template #body>
              <UForm
                id="create-category-form"
                @submit="
                  updateCategory(
                    (newValues = {
                      id: category.id,
                      name: category.name
                    })
                  )
                "
              >
                <UFormField label="Category">
                  <UInput v-model="category.name" placeholder="Enter Name" class="w-full" />
                </UFormField>
              </UForm>
            </template>

            <template #footer>
              <UContainer class="w-full flex justify-end !m-0 !p-0">
                <UButton label="Save" type="submit" form="create-category-form" />
              </UContainer>
            </template>
          </UModal>

          <UModal title="Delete Category">
            <UButton icon="i-fa-trash" color="error" class="flex-shrink-0" />
            <template #body>
              <UForm id="delete-category-form" @submit="deleteCategory(category.id)">
                <h6>
                  Are you sure you want to delete <strong>"{{ category.name }}"</strong>?
                </h6>
              </UForm>
            </template>

            <template #footer>
              <UContainer class="w-full flex justify-end !m-0 !p-0">
                <UButton label="Delete" color="error" type="submit" form="delete-category-form" />
              </UContainer>
            </template>
          </UModal>
        </UContainer>
      </UContainer>
    </template>
  </UPageCard>
</template>
