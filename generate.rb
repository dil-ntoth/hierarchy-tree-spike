#!/usr/bin/ruby

require 'faker'
require 'securerandom'

LIMIT = 300
TYPES = %w(process org_unit)

# rand(1..10)
data = []
#
# # Random data generator
# def random_data(parent_id = nil)
#   # uuid = Securerandom.uuid
#   { title: Faker::Book.title, type: TYPES.sample, level: 0, id: SecureRandom.uuid, parent: parent_id, children: [] }
# end
#
# LIMIT.times do 
#   #child_data = { title: Faker::Book.title, type: TYPES.sample, level: 0, id: uuid }
#   child_data = random_data
#   children = []
#   rand(1..10).times do
#     children << random_data(child_data[:id])
#   end
#
#   child_data[:children] = children
#   data << child_data
# end
#
#
# #puts data
# d = []
# 1000.times do 
#   d << { id: SecureRandom.uuid, label: Faker::Book.title }
# end

def gen_child(parent_id)
  { id: SecureRandom.uuid, parentId: parent_id, label: Faker::Book.title }
end

LIMIT.times do
  id = SecureRandom.uuid
  node = { id: id, label: Faker::Book.title, children: Array.new(rand(1..10)) { gen_child(id) } }

  data << node
end

#puts d.to_json

puts data.to_json

